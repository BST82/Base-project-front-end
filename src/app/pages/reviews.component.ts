import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReviewService } from '../core/services/review.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      
      <!-- Header: Sweetgreen Style -->
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">Community Impressions</span>
        <h1 class="font-serif text-4xl sm:text-5xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-2">Diner Stories & Reviews</h1>
        <p class="text-sm text-[#19231a]/70 dark:text-slate-300 mt-3">
          Verified dining reflections from guests who shared our culinary theater and farm harvests.
        </p>

        <button 
          (click)="showSubmitModal.set(true)"
          class="mt-6 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
          Write a Review ★
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="reviewService.loading()" class="py-16 text-center text-slate-400 text-xs">
        <div class="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p>Gathering guest stories...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!reviewService.loading() && reviewService.reviews().length === 0" class="bg-white dark:bg-[#142219] rounded-3xl p-12 text-center border border-[#e8e4dc] dark:border-[#1f3527]">
        <p class="text-4xl mb-2">🌿</p>
        <p class="font-serif text-[#133820] dark:text-slate-200 text-xl font-bold">No public reviews yet.</p>
        <p class="text-xs text-slate-500 mt-1">Be the very first guest to share your dining experience.</p>
      </div>

      <!-- Reviews Grid -->
      <div *ngIf="!reviewService.loading()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          *ngFor="let r of reviewService.reviews()" 
          class="bg-white dark:bg-[#142219] rounded-3xl p-6 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <!-- Rating Stars -->
              <div class="flex text-amber-500 text-base">
                <span *ngFor="let star of [1,2,3,4,5]">
                  {{ star <= r.rating ? '★' : '☆' }}
                </span>
              </div>
              <span class="text-[11px] text-slate-500 dark:text-slate-400">{{ r.created_at | date:'mediumDate' }}</span>
            </div>

            <p class="text-sm text-[#19231a] dark:text-slate-200 leading-relaxed italic">
              "{{ r.comment }}"
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#f4ede0] dark:border-[#1f3527] flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#eaf4eb] dark:bg-emerald-950/80 text-[#133820] dark:text-[#4ade80] flex items-center justify-center font-bold text-xs uppercase border border-emerald-300 dark:border-emerald-700/60">
              {{ r.customer_name[0] }}
            </div>
            <div>
              <p class="text-xs font-bold text-[#133820] dark:text-slate-200">{{ r.customer_name }}</p>
              <p class="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">✓ Verified Diner</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Review Submission Modal -->
      <div *ngIf="showSubmitModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="relative w-full max-w-md bg-white dark:bg-[#142219] border border-[#e8e4dc] dark:border-[#1f3527] rounded-3xl p-8 shadow-2xl space-y-6">
          <button 
            (click)="showSubmitModal.set(false)" 
            class="absolute top-5 right-5 text-slate-400 hover:text-black dark:hover:text-white"
            aria-label="Close modal">
            ✕
          </button>

          <div>
            <h3 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Share Your Impressions</h3>
            <p class="text-xs text-[#19231a]/70 dark:text-slate-400 mt-1">Your review will be published to the dining community upon moderation.</p>
          </div>

          <div *ngIf="submitSuccess()" class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-600/40 text-emerald-800 dark:text-emerald-300 text-xs text-center font-semibold">
            Thank you! Your dining review has been submitted for moderation.
          </div>

          <form *ngIf="!submitSuccess()" [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Your Name</label>
              <input 
                type="text" 
                formControlName="customer_name" 
                placeholder="e.g. Jordan Hayes"
                class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Rating</label>
              <div class="flex gap-2">
                <button 
                  type="button"
                  *ngFor="let star of [1,2,3,4,5]" 
                  (click)="selectedRating.set(star)"
                  class="text-2xl transition-transform hover:scale-125 focus:outline-none"
                  [class.text-amber-500]="star <= selectedRating()"
                  [class.text-slate-300]="star > selectedRating()">
                  ★
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-[#19231a]/70 dark:text-slate-400 mb-1">Your Dining Feedback</label>
              <textarea 
                formControlName="comment" 
                rows="4" 
                placeholder="Share thoughts on the dishes, atmosphere, service, or ingredients..."
                class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-[#19231a] dark:text-[#f3f4f6] text-sm focus:outline-none focus:border-emerald-600"></textarea>
            </div>

            <button 
              type="submit" 
              [disabled]="form.invalid || submitting()"
              class="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] disabled:opacity-40 transition-all shadow-md">
              {{ submitting() ? 'Submitting...' : 'Submit Review' }}
            </button>
          </form>
        </div>
      </div>

    </div>
  `
})
export class ReviewsComponent implements OnInit {
  reviewService = inject(ReviewService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  readonly showSubmitModal = signal(false);
  readonly selectedRating = signal(5);
  readonly submitting = signal(false);
  readonly submitSuccess = signal(false);

  readonly form = this.fb.group({
    customer_name: ['', [Validators.required, Validators.minLength(2)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.form.patchValue({ customer_name: user.name });
    }
    this.reviewService.loadApprovedReviews().subscribe();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);

    this.reviewService.submitReview({
      customer_name: this.form.value.customer_name!,
      rating: this.selectedRating(),
      comment: this.form.value.comment!
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitSuccess.set(true);
        setTimeout(() => {
          this.showSubmitModal.set(false);
          this.submitSuccess.set(false);
          this.form.reset();
        }, 2500);
      },
      error: () => {
        this.submitting.set(false);
      }
    });
  }
}
