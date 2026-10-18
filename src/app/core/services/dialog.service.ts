import { Injectable, signal } from '@angular/core';

export type DialogType = 'danger' | 'warning' | 'info';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
  icon?: string;
  itemName?: string;
}

interface ActiveDialogState {
  config: DialogConfig;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  readonly activeDialog = signal<ActiveDialogState | null>(null);

  confirm(config: DialogConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.activeDialog.set({
        config: {
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          type: 'danger',
          ...config
        },
        resolve
      });
    });
  }

  handleConfirm(): void {
    const current = this.activeDialog();
    if (current) {
      this.activeDialog.set(null);
      current.resolve(true);
    }
  }

  handleCancel(): void {
    const current = this.activeDialog();
    if (current) {
      this.activeDialog.set(null);
      current.resolve(false);
    }
  }
}
