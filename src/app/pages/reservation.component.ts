import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../core/services/reservation.service';
import { PaymentService } from '../core/services/payment.service';
import { ContentService } from '../core/services/content.service';
import { AuthService } from '../core/services/auth.service';
import { AvailableSlot, Reservation, PaymentOrderResponse } from '../core/models';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      
      <!-- Stepper Wizard Header: Sweetgreen Style -->
      <div class="text-center mb-10">
        <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">Seamless Seating</span>
        <h1 class="font-serif text-3xl sm:text-4xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-1">Table Reservation & Deposit</h1>
        <p class="text-xs sm:text-sm text-[#19231a]/70 dark:text-slate-300 mt-2">
          Real-time slot allocation backed by temporary Redis locking & secure prepayment deposit.
        </p>

        <!-- Stepper Indicator -->
        <div class="flex items-center justify-center gap-2 sm:gap-6 mt-8 overflow-x-auto pb-2">
          <div [class]="step() >= 1 ? 'text-[#133820] dark:text-[#4ade80] border-emerald-700 dark:border-emerald-500 font-bold' : 'text-slate-400 border-slate-200 dark:border-slate-800'" class="flex items-center gap-2 border-b-2 pb-2 text-xs">
            <span class="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]" [class]="step() >= 1 ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600' : ''">1</span>
            <span>Date & Slot</span>
          </div>
          <div [class]="step() >= 2 ? 'text-[#133820] dark:text-[#4ade80] border-emerald-700 dark:border-emerald-500 font-bold' : 'text-slate-400 border-slate-200 dark:border-slate-800'" class="flex items-center gap-2 border-b-2 pb-2 text-xs">
            <span class="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]" [class]="step() >= 2 ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600' : ''">2</span>
            <span>Guest Details</span>
          </div>
          <div [class]="step() >= 3 ? 'text-[#133820] dark:text-[#4ade80] border-emerald-700 dark:border-emerald-500 font-bold' : 'text-slate-400 border-slate-200 dark:border-slate-800'" class="flex items-center gap-2 border-b-2 pb-2 text-xs">
            <span class="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]" [class]="step() >= 3 ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600' : ''">3</span>
            <span>Prepayment</span>
          </div>
          <div [class]="step() >= 4 ? 'text-[#133820] dark:text-[#4ade80] border-emerald-700 dark:border-emerald-500 font-bold' : 'text-slate-400 border-slate-200 dark:border-slate-800'" class="flex items-center gap-2 border-b-2 pb-2 text-xs">
            <span class="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]" [class]="step() >= 4 ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600' : ''">4</span>
            <span>Confirmed</span>
          </div>
        </div>
      </div>

      <!-- Redis Hold Timer Alert -->
      <div *ngIf="slotHeld() && step() < 4" class="mb-8 p-4 rounded-2xl bg-[#eaf4eb] dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 shadow-sm">
        <div class="flex items-center gap-2.5">
          <span class="text-base">⏳</span>
          <span>Table <strong>{{ selectedSlot()?.table_number }}</strong> is temporarily held for your session in Redis.</span>
        </div>
        <div class="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">
          {{ formattedCountdown() }}
        </div>
      </div>

      <!-- Error Alert -->
      <div *ngIf="errorMessage()" class="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs">
        {{ errorMessage() }}
      </div>

      <!-- STEP 1: DATE, GUESTS & SLOTS -->
      <div *ngIf="step() === 1" class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-2">Dining Date</label>
            <input 
              type="date" 
              [(ngModel)]="dateInput" 
              [min]="minDate"
              (change)="onDateOrGuestsChange()"
              class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600">
          </div>

          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-2">Party Size</label>
            <select 
              [(ngModel)]="guestsInput" 
              (change)="onDateOrGuestsChange()"
              class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600">
              <option *ngFor="let n of [1,2,3,4,5,6,7,8]" [value]="n">{{ n }} {{ n === 1 ? 'Guest' : 'Guests' }}</option>
            </select>
          </div>
        </div>

        <!-- Available Slots List -->
        <div class="pt-4 border-t border-[#f4ede0] dark:border-[#1f3527]">
          <h3 class="text-sm font-bold text-[#133820] dark:text-slate-200 mb-4">Available Dining Times & Seating:</h3>
          
          <div *ngIf="loadingSlots()" class="py-12 text-center text-slate-400 text-xs">
            <div class="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Scanning dining floor & checking real-time availability...</p>
          </div>

          <div *ngIf="!loadingSlots() && slots().length === 0" class="py-10 text-center text-slate-500 text-xs border border-dashed border-[#e8e4dc] dark:border-[#1f3527] rounded-2xl">
            No tables available for {{ guestsInput }} guests on this date. Please select another date.
          </div>

          <div *ngIf="!loadingSlots() && slots().length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button 
              *ngFor="let slot of slots()" 
              (click)="onSelectSlot(slot)"
              [disabled]="!slot.is_available"
              [class]="selectedSlot() === slot 
                ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md' 
                : (slot.is_available ? 'bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-slate-200 border border-[#e8e4dc] dark:border-[#1f3527] hover:border-emerald-600' : 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-dark-900 border-transparent')"
              class="p-4 rounded-2xl text-left transition-all flex flex-col justify-between">
              
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm">{{ slot.slot_start }} – {{ slot.slot_end }}</span>
                <span [class]="slot.is_available ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'" class="text-[10px] font-bold uppercase">
                  {{ slot.is_available ? 'Available' : 'Booked' }}
                </span>
              </div>

              <div class="mt-2 text-xs opacity-80 flex items-center justify-between">
                <span>Table {{ slot.table_number }} ({{ slot.capacity }} seats)</span>
                <span class="capitalize">{{ slot.location }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Next Action -->
        <div class="pt-6 border-t border-[#f4ede0] dark:border-[#1f3527] flex justify-end">
          <button 
            (click)="proceedToStep2()" 
            [disabled]="!selectedSlot() || holding()"
            class="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] disabled:opacity-40 transition-all shadow-md">
            {{ holding() ? 'Holding Table in Redis...' : 'Lock Slot & Enter Guest Info →' }}
          </button>
        </div>
      </div>

      <!-- STEP 2: GUEST DETAILS -->
      <div *ngIf="step() === 2" class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-6">
        <div>
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Guest Contact Information</h2>
          <p class="text-xs text-[#19231a]/70 dark:text-slate-400 mt-1">We'll dispatch booking confirmation & receipt to this email.</p>
        </div>

        <form [formGroup]="guestForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Full Name</label>
              <input type="text" formControlName="customer_name" placeholder="e.g. Jordan Hayes" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Email Address</label>
              <input type="email" formControlName="customer_email" placeholder="jordan@example.com" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600">
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Phone Number (SMS updates)</label>
            <input type="tel" formControlName="customer_phone" placeholder="+1 (555) 234-5678" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600">
          </div>

          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Special Dietary / Seating Requests</label>
            <textarea formControlName="special_requests" rows="3" placeholder="Allergies, high chair, window preference, anniversary..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600"></textarea>
          </div>
        </form>

        <div class="pt-6 border-t border-[#f4ede0] dark:border-[#1f3527] flex justify-between items-center">
          <button (click)="step.set(1)" class="text-xs font-bold text-[#133820] dark:text-emerald-400 hover:underline">
            ← Back to Slot Selection
          </button>
          <button 
            (click)="proceedToStep3()" 
            [disabled]="guestForm.invalid || creatingBooking()"
            class="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] disabled:opacity-40 transition-all shadow-md">
            {{ creatingBooking() ? 'Reserving Table...' : 'Proceed to Prepayment Deposit →' }}
          </button>
        </div>
      </div>

      <!-- STEP 3: PREPAYMENT -->
      <div *ngIf="step() === 3" class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-6">
        <div>
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Reservation Deposit & Guarantee</h2>
          <p class="text-xs text-[#19231a]/70 dark:text-slate-400 mt-1">
            Deposit of <strong>{{ contentService.contents()['currency_symbol'] || '$' }}{{ paymentOrder()?.amount | number:'1.2-2' }}</strong> is fully deducted from your final dining bill.
          </p>
        </div>

        <!-- Payment Method Tabs -->
        <div class="flex gap-2 border-b border-[#f4ede0] dark:border-[#1f3527] pb-3">
          <button 
            (click)="selectedMethod.set('UPI_QR')"
            [class]="selectedMethod() === 'UPI_QR' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold' : 'bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527]'"
            class="px-5 py-2 rounded-full text-xs transition-colors">
            📱 UPI QR Code
          </button>
          <button 
            (click)="selectedMethod.set('CARD')"
            [class]="selectedMethod() === 'CARD' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold' : 'bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527]'"
            class="px-5 py-2 rounded-full text-xs transition-colors">
            💳 Credit / Debit Card
          </button>
        </div>

        <!-- UPI QR View -->
        <div *ngIf="selectedMethod() === 'UPI_QR'" class="text-center p-6 bg-[#faf8f5] dark:bg-[#0c1510] rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] space-y-4">
          <div class="w-48 h-48 bg-white p-3 rounded-2xl mx-auto shadow-md border flex items-center justify-center">
            <img 
              [src]="'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(paymentOrder()?.qr_code_string || 'upi://pay')" 
              alt="UPI Payment QR"
              class="w-full h-full object-contain">
          </div>
          <p class="text-xs text-[#19231a]/80 dark:text-slate-300">
            Scan using any UPI App (Google Pay, PhonePe, Paytm)
          </p>
          <button 
            (click)="simulatePaymentSuccess()"
            [disabled]="verifyingPayment()"
            class="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm">
            <span *ngIf="!verifyingPayment()">Simulate Successful Scan & Pay</span>
            <span *ngIf="verifyingPayment()">Confirming Transaction...</span>
          </button>
        </div>

        <!-- Card View -->
        <div *ngIf="selectedMethod() === 'CARD'" class="space-y-4 p-6 bg-[#faf8f5] dark:bg-[#0c1510] rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527]">
          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Card Number</label>
            <input type="text" placeholder="4242 •••• •••• 4242" class="w-full px-4 py-3 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Expiry</label>
              <input type="text" placeholder="MM/YY" class="w-full px-4 py-3 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm">
            </div>
            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">CVC</label>
              <input type="text" placeholder="•••" class="w-full px-4 py-3 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm">
            </div>
          </div>
          <button 
            (click)="simulatePaymentSuccess()"
            [disabled]="verifyingPayment()"
            class="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] transition-colors shadow-md">
            <span *ngIf="!verifyingPayment()">Pay {{ contentService.contents()['currency_symbol'] || '$' }}{{ paymentOrder()?.amount | number:'1.2-2' }} Deposit</span>
            <span *ngIf="verifyingPayment()">Processing Card...</span>
          </button>
        </div>
      </div>

      <!-- STEP 4: CONFIRMATION -->
      <div *ngIf="step() === 4" class="bg-white dark:bg-[#142219] rounded-3xl p-8 sm:p-12 text-center border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-6">
        <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-700 dark:text-emerald-400 text-3xl flex items-center justify-center mx-auto">
          ✓
        </div>

        <div>
          <span class="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Reservation Confirmed</span>
          <h2 class="font-serif text-3xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-1">We Look Forward to Welcoming You</h2>
          <p class="text-xs text-[#19231a]/70 dark:text-slate-400 mt-2">
            A confirmation receipt has been dispatched to <strong>{{ confirmedReservation()?.customer_email }}</strong>.
          </p>
        </div>

        <div class="max-w-md mx-auto p-5 rounded-2xl bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e8e4dc] dark:border-[#1f3527] text-xs text-left space-y-2.5 font-mono">
          <div class="flex justify-between"><span class="text-slate-500">Booking Ref:</span> <span class="text-emerald-800 dark:text-emerald-400 font-bold">#RES-{{ confirmedReservation()?.id }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Date:</span> <span class="text-[#19231a] dark:text-slate-200">{{ confirmedReservation()?.reservation_date }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Time:</span> <span class="text-[#19231a] dark:text-slate-200">{{ confirmedReservation()?.slot_start }} – {{ confirmedReservation()?.slot_end }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Table:</span> <span class="text-[#19231a] dark:text-slate-200">{{ selectedSlot()?.table_number }} ({{ selectedSlot()?.location }})</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Party Size:</span> <span class="text-[#19231a] dark:text-slate-200">{{ confirmedReservation()?.guests }} Guests</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Prepayment Status:</span> <span class="text-emerald-700 dark:text-emerald-400 font-bold">PAID & VERIFIED</span></div>
        </div>

        <div class="pt-4 flex justify-center gap-4">
          <a routerLink="/" class="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-[#0c1510] text-[#133820] dark:text-slate-200 border border-[#e8e4dc] dark:border-[#1f3527] hover:bg-[#f4ede0]">
            Back to Home
          </a>
          <a routerLink="/menu" class="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#133820] text-white hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510]">
            Preview Harvest Menu
          </a>
        </div>
      </div>

    </div>
  `
})
export class ReservationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private resvService = inject(ReservationService);
  private paymentService = inject(PaymentService);
  contentService = inject(ContentService);
  authService = inject(AuthService);

  readonly step = signal<number>(1);
  readonly slots = signal<AvailableSlot[]>([]);
  readonly selectedSlot = signal<AvailableSlot | null>(null);
  readonly slotHeld = signal<boolean>(false);
  readonly holding = signal<boolean>(false);
  readonly creatingBooking = signal<boolean>(false);
  readonly verifyingPayment = signal<boolean>(false);
  readonly loadingSlots = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  readonly paymentOrder = signal<PaymentOrderResponse | null>(null);
  readonly confirmedReservation = signal<Reservation | null>(null);
  readonly selectedMethod = signal<'UPI_QR' | 'CARD'>('UPI_QR');

  // Form controls
  dateInput = new Date().toISOString().split('T')[0];
  minDate = new Date().toISOString().split('T')[0];
  guestsInput = 2;

  sessionId = 'sess_' + Math.random().toString(36).substring(2, 12);
  holdRemainingSeconds = signal<number>(600);
  private timerInterval: any = null;

  readonly guestForm = this.fb.group({
    customer_name: ['', [Validators.required, Validators.minLength(2)]],
    customer_email: ['', [Validators.required, Validators.email]],
    customer_phone: ['', [Validators.required, Validators.minLength(7)]],
    special_requests: ['']
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.guestForm.patchValue({
        customer_name: user.name,
        customer_email: ''
      });
    }
    this.fetchSlots();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onDateOrGuestsChange(): void {
    this.selectedSlot.set(null);
    this.fetchSlots();
  }

  fetchSlots(): void {
    this.loadingSlots.set(true);
    this.errorMessage.set('');
    this.resvService.getAvailableSlots(this.dateInput, this.guestsInput).subscribe({
      next: (slots) => {
        this.slots.set(slots);
        this.loadingSlots.set(false);
      },
      error: (err) => {
        this.loadingSlots.set(false);
        this.errorMessage.set('Failed to load slots from database.');
      }
    });
  }

  onSelectSlot(slot: AvailableSlot): void {
    if (!slot.is_available) return;
    this.selectedSlot.set(slot);
  }

  proceedToStep2(): void {
    const slot = this.selectedSlot();
    if (!slot) return;

    this.holding.set(true);
    this.errorMessage.set('');

    this.resvService.holdSlot(slot.table_id, this.dateInput, slot.slot_start, this.sessionId).subscribe({
      next: (res) => {
        this.holding.set(false);
        this.slotHeld.set(true);
        this.holdRemainingSeconds.set(res.held_until_seconds);
        this.startCountdownTimer();
        this.step.set(2);
      },
      error: (err) => {
        this.holding.set(false);
        this.errorMessage.set(err.error?.detail || 'Table is currently held by another guest. Please choose another.');
        this.fetchSlots();
      }
    });
  }

  private startCountdownTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.holdRemainingSeconds.update((s) => {
        if (s <= 1) {
          clearInterval(this.timerInterval);
          this.slotHeld.set(false);
          this.step.set(1);
          this.errorMessage.set('Hold expired. Please select a table again.');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  formattedCountdown(): string {
    const s = this.holdRemainingSeconds();
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `${m}:${remS < 10 ? '0' : ''}${remS}`;
  }

  proceedToStep3(): void {
    if (this.guestForm.invalid) return;
    const slot = this.selectedSlot();
    if (!slot) return;

    this.creatingBooking.set(true);
    this.errorMessage.set('');

    this.resvService.bookReservation({
      table_id: slot.table_id,
      reservation_date: this.dateInput,
      slot_start: slot.slot_start,
      slot_end: slot.slot_end,
      guests: this.guestsInput,
      customer_name: this.guestForm.value.customer_name!,
      customer_email: this.guestForm.value.customer_email!,
      customer_phone: this.guestForm.value.customer_phone!,
      special_requests: this.guestForm.value.special_requests || '',
      session_id: this.sessionId
    }).subscribe({
      next: (reservation) => {
        this.confirmedReservation.set(reservation);
        this.paymentService.createOrder(reservation.id, 'razorpay', 'UPI').subscribe({
          next: (order) => {
            this.paymentOrder.set(order);
            this.creatingBooking.set(false);
            this.step.set(3);
          },
          error: (err) => {
            this.creatingBooking.set(false);
            this.errorMessage.set('Could not initialize payment gateway.');
          }
        });
      },
      error: (err) => {
        this.creatingBooking.set(false);
        this.errorMessage.set(err.error?.detail || 'Failed to place reservation.');
      }
    });
  }

  encodeURIComponent(val: string): string {
    return encodeURIComponent(val);
  }

  simulatePaymentSuccess(): void {
    const order = this.paymentOrder();
    if (!order) return;

    this.verifyingPayment.set(true);
    const mockPaymentId = 'pay_' + Math.random().toString(36).substring(2, 12);
    const mockSignature = 'test_sig_' + Math.random().toString(36).substring(2, 12);

    this.paymentService.verifyPayment({
      order_id: order.order_id,
      payment_id: mockPaymentId,
      signature: mockSignature,
      gateway: order.gateway
    }).subscribe({
      next: () => {
        this.verifyingPayment.set(false);
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.slotHeld.set(false);
        this.step.set(4);
      },
      error: (err) => {
        this.verifyingPayment.set(false);
        this.errorMessage.set(err.error?.detail || 'Payment verification failed');
      }
    });
  }
}
