import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastItem } from '../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite">
      
      <div 
        *ngFor="let toast of toastService.toasts()" 
        class="pointer-events-auto w-full p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3 relative overflow-hidden"
        [ngClass]="{
          'bg-white/95 dark:bg-[#132218]/95 border-emerald-500/30 text-[#133820] dark:text-[#f3f4f6]': toast.type === 'success',
          'bg-white/95 dark:bg-[#241315]/95 border-red-500/40 text-red-950 dark:text-red-100': toast.type === 'error',
          'bg-white/95 dark:bg-[#241d13]/95 border-amber-500/40 text-amber-950 dark:text-amber-100': toast.type === 'warning',
          'bg-white/95 dark:bg-[#131d24]/95 border-blue-500/30 text-blue-950 dark:text-blue-100': toast.type === 'info'
        }">
        
        <!-- Type Icon -->
        <div class="shrink-0 mt-0.5">
          <!-- Success -->
          <div *ngIf="toast.type === 'success'" class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <!-- Error -->
          <div *ngIf="toast.type === 'error'" class="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold">
            ✕
          </div>
          <!-- Warning -->
          <div *ngIf="toast.type === 'warning'" class="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
            !
          </div>
          <!-- Info -->
          <div *ngIf="toast.type === 'info'" class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
            ℹ
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 space-y-0.5 min-w-0 pr-4">
          <p class="text-xs font-bold tracking-tight">
            {{ toast.title }}
          </p>
          <p *ngIf="toast.description" class="text-[11px] opacity-80 leading-relaxed break-words">
            {{ toast.description }}
          </p>
        </div>

        <!-- Dismiss Button -->
        <button 
          (click)="toastService.dismiss(toast.id)"
          class="shrink-0 text-xs opacity-50 hover:opacity-100 transition-opacity p-1"
          aria-label="Dismiss toast">
          ✕
        </button>

        <!-- Subtle Top Accent Indicator -->
        <div 
          class="absolute top-0 left-0 right-0 h-0.5"
          [ngClass]="{
            'bg-emerald-500': toast.type === 'success',
            'bg-red-500': toast.type === 'error',
            'bg-amber-500': toast.type === 'warning',
            'bg-blue-500': toast.type === 'info'
          }">
        </div>

      </div>

    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
