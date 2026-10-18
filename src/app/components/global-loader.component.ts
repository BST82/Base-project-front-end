import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../core/services/loading.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Top Progress Bar (YouTube/GitHub Style) -->
    <div 
      *ngIf="loadingService.isLoading()" 
      class="fixed top-0 left-0 right-0 z-[100] h-1 overflow-hidden pointer-events-none bg-emerald-950/20">
      <div class="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 w-full animate-indeterminate"></div>
    </div>

    <!-- Floating Micro Status Pill in Bottom Left (Non-intrusive) -->
    <div 
      *ngIf="loadingService.isLoading()"
      class="fixed bottom-5 left-5 z-40 pointer-events-none transition-all duration-300">
      <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/75 dark:bg-[#111e15]/90 text-white dark:text-emerald-300 backdrop-blur-md border border-white/15 dark:border-emerald-600/30 text-[11px] font-medium shadow-lg animate-fade-in">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>Syncing data...</span>
      </div>
    </div>
  `,
  styles: [`
    @keyframes indeterminate {
      0% {
        transform: translateX(-100%);
      }
      50% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(100%);
      }
    }
    .animate-indeterminate {
      animation: indeterminate 1.4s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395);
    }
  `]
})
export class GlobalLoaderComponent {
  loadingService = inject(LoadingService);
}
