import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
  duration: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<ToastItem[]>([]);

  success(title: string, description?: string, duration: number = 4000): number {
    return this.show('success', title, description, duration);
  }

  error(title: string, description?: string, duration: number = 5000): number {
    return this.show('error', title, description, duration);
  }

  info(title: string, description?: string, duration: number = 4000): number {
    return this.show('info', title, description, duration);
  }

  warning(title: string, description?: string, duration: number = 4500): number {
    return this.show('warning', title, description, duration);
  }

  show(type: ToastType, title: string, description?: string, duration: number = 4000): number {
    const id = this.nextId++;
    const newToast: ToastItem = {
      id,
      type,
      title,
      description,
      duration,
      createdAt: Date.now()
    };

    // Keep up to 5 concurrent toasts
    this.toasts.update((current) => [...current.slice(-4), newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
