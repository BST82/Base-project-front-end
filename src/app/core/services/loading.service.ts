import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _activeRequests = signal<number>(0);

  /** Public reactive loading state: true if any HTTP request is in-flight */
  readonly isLoading = computed(() => this._activeRequests() > 0);
  readonly activeCount = computed(() => this._activeRequests());

  show(): void {
    this._activeRequests.update((n) => n + 1);
  }

  hide(): void {
    this._activeRequests.update((n) => Math.max(0, n - 1));
  }

  reset(): void {
    this._activeRequests.set(0);
  }
}
