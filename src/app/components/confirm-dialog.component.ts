import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../core/services/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="dialogService.activeDialog()" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in"
      (click)="dialogService.handleCancel()"
      role="dialog"
      aria-modal="true">
      
      <!-- Modal Box (Stops click propagation) -->
      <div 
        (click)="$event.stopPropagation()"
        class="bg-[#faf8f5] dark:bg-[#121e16] w-full max-w-md rounded-3xl p-6 sm:p-7 border border-[#e8e4dc] dark:border-[#22382b] shadow-2xl relative transform transition-all animate-scale-up space-y-5 text-center sm:text-left">
        
        <!-- Header & Icon Badge -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <!-- Styled Icon Ring -->
          <div 
            [ngClass]="{
              'bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400 border-red-200 dark:border-red-900/60': dialogService.activeDialog()?.config?.type === 'danger',
              'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 border-amber-200 dark:border-amber-900/60': dialogService.activeDialog()?.config?.type === 'warning',
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60': dialogService.activeDialog()?.config?.type === 'info'
            }"
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border shadow-sm">
            <span *ngIf="dialogService.activeDialog()?.config?.type === 'danger'">🗑️</span>
            <span *ngIf="dialogService.activeDialog()?.config?.type === 'warning'">⚠️</span>
            <span *ngIf="dialogService.activeDialog()?.config?.type === 'info'">ℹ️</span>
          </div>

          <!-- Title and Description -->
          <div class="space-y-1">
            <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6]">
              {{ dialogService.activeDialog()?.config?.title }}
            </h3>
            <p class="text-xs text-[#19231a]/75 dark:text-slate-300 leading-relaxed">
              {{ dialogService.activeDialog()?.config?.message }}
            </p>
          </div>
        </div>

        <!-- Item Name Callout Pill (if specified) -->
        <div 
          *ngIf="dialogService.activeDialog()?.config?.itemName"
          class="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-center text-[#133820] dark:text-emerald-300 truncate">
          {{ dialogService.activeDialog()?.config?.itemName }}
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <button 
            type="button"
            (click)="dialogService.handleCancel()"
            class="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold text-[#19231a] dark:text-slate-300 bg-white dark:bg-[#1a2c20] border border-[#dcd7cd] dark:border-[#2a4534] hover:bg-[#eae4d9] dark:hover:bg-[#223a2a] transition-all">
            {{ dialogService.activeDialog()?.config?.cancelText || 'Cancel' }}
          </button>
          
          <button 
            type="button"
            (click)="dialogService.handleConfirm()"
            [ngClass]="{
              'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30': dialogService.activeDialog()?.config?.type === 'danger',
              'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30': dialogService.activeDialog()?.config?.type === 'warning',
              'bg-[#133820] hover:bg-[#1c4d2d] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] text-white dark:text-[#0c1510] shadow-lg': dialogService.activeDialog()?.config?.type === 'info'
            }"
            class="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            {{ dialogService.activeDialog()?.config?.confirmText || 'Confirm' }}
          </button>
        </div>

      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  dialogService = inject(DialogService);
}
