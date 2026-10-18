import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="relative w-full max-w-md bg-white dark:bg-[#142219] border border-[#e8e4dc] dark:border-[#1f3527] rounded-3xl p-8 shadow-2xl">
        <!-- Close Button -->
        <button 
          (click)="close.emit()" 
          class="absolute top-5 right-5 text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close modal">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 font-serif font-black text-2xl mx-auto flex items-center justify-center mb-2 shadow-sm border border-emerald-300/40">
            A
          </div>
          <h3 class="text-2xl font-serif font-bold text-[#133820] dark:text-[#f3f4f6]">
            {{ isRegister() ? 'Join Aura Community' : 'Welcome to Aura Bistro' }}
          </h3>
          <p class="text-xs text-[#19231a]/70 dark:text-slate-400 mt-1">
            {{ isRegister() ? 'Create your diner account for reservations and farm stories' : 'Sign in to access your dining bookings and preferences' }}
          </p>
        </div>

        <!-- Quick Demo Credentials Fill -->
        <div *ngIf="!isRegister()" class="mb-5 p-3 rounded-2xl bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e8e4dc] dark:border-[#1f3527] flex items-center justify-between text-xs">
          <span class="text-[#19231a]/70 dark:text-slate-300 font-semibold">Demo Sign-In:</span>
          <div class="flex gap-2">
            <button 
              type="button" 
              (click)="fillDemo('admin')" 
              class="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-200 transition-colors">
              👑 Admin
            </button>
            <button 
              type="button" 
              (click)="fillDemo('customer')" 
              class="px-3 py-1 text-xs font-bold rounded-full bg-slate-200 dark:bg-dark-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors">
              👤 User
            </button>
          </div>
        </div>

        <!-- Error Banner -->
        <div *ngIf="errorMessage()" class="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-medium">
          {{ errorMessage() }}
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div *ngIf="isRegister()">
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Full Name</label>
            <input 
              type="text" 
              formControlName="name"
              placeholder="e.g. Eleanor Vance" 
              class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600 transition-colors">
          </div>

          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              formControlName="email"
              placeholder="name@domain.com" 
              class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600 transition-colors">
          </div>

          <div>
            <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              formControlName="password"
              placeholder="••••••••" 
              class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600 transition-colors">
          </div>

          <!-- RBAC Security Badge on Registration -->
          <div *ngIf="isRegister()" class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span>🛡️</span>
            <span>All public registrations are assigned standard <strong>User</strong> access by default.</span>
          </div>

          <button 
            type="submit" 
            [disabled]="loading() || form.invalid"
            class="w-full py-3.5 mt-2 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] disabled:opacity-40 transition-all shadow-md">
            <span *ngIf="!loading()">{{ isRegister() ? 'Create User Account' : 'Sign In' }}</span>
            <span *ngIf="loading()">Processing...</span>
          </button>
        </form>

        <!-- Toggle Register/Login -->
        <div class="mt-5 text-center text-xs text-[#19231a]/70 dark:text-slate-400">
          <span *ngIf="!isRegister()">Don't have an account? </span>
          <span *ngIf="isRegister()">Already have an account? </span>
          <button 
            type="button" 
            (click)="toggleMode()" 
            class="text-emerald-800 dark:text-emerald-400 hover:underline font-bold">
            {{ isRegister() ? 'Sign In Here' : 'Create Free Account' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginModalComponent implements OnInit {
  @Input() initialMode: 'login' | 'register' = 'login';
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  readonly isRegister = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  ngOnInit(): void {
    if (this.initialMode === 'register') {
      this.isRegister.set(true);
    } else {
      this.isRegister.set(false);
    }
  }

  toggleMode(): void {
    this.isRegister.update((v) => !v);
    this.errorMessage.set('');
  }

  fillDemo(role: 'admin' | 'customer'): void {
    if (role === 'admin') {
      this.form.patchValue({
        email: 'admin@restaurant.com',
        password: 'admin123'
      });
    } else {
      this.form.patchValue({
        email: 'customer@example.com',
        password: 'customer123'
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password, name } = this.form.value;

    if (this.isRegister()) {
      // Public registration: strictly name, email, password. Role defaults to USER/CUSTOMER on server.
      this.authService.register({ name: name || 'Diner', email: email!, password: password! }).subscribe({
        next: () => {
          this.authService.login({ email: email!, password: password! }).subscribe({
            next: (res) => {
              this.loading.set(false);
              this.toastService.success(`Welcome to Aura Bistro, ${res.name}!`);
              this.loginSuccess.emit();
              this.close.emit();
            },
            error: (err) => {
              this.loading.set(false);
              this.errorMessage.set(err.error?.detail || 'Sign in failed');
            }
          });
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.detail || 'Registration failed');
        }
      });
    } else {
      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (res) => {
          this.loading.set(false);
          const roleLabel = res.role === 'admin' ? 'Administrator' : 'Guest';
          this.toastService.success(`Welcome back, ${res.name} (${roleLabel})!`);
          this.loginSuccess.emit();
          this.close.emit();
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.detail || 'Invalid email or password');
        }
      });
    }
  }
}

