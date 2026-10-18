import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/auth';
  private storageKey = 'aura_auth_session';

  readonly currentUser = signal<AuthResponse | null>(this.loadStoredUser());
  readonly isLoggedIn = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role?.toLowerCase() === 'admin');
  readonly isCustomer = computed(() => this.isLoggedIn() && !this.isAdmin());

  private getStorage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        return window.localStorage;
      }
    } catch {
      return null;
    }
    return null;
  }

  private loadStoredUser(): AuthResponse | null {
    try {
      const storage = this.getStorage();
      if (!storage) return null;
      const data = storage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        try {
          const storage = this.getStorage();
          storage?.setItem(this.storageKey, JSON.stringify(res));
        } catch {
          // ignore
        }
        this.currentUser.set(res);
      })
    );
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    try {
      const storage = this.getStorage();
      storage?.removeItem(this.storageKey);
    } catch {
      // ignore
    }
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return this.currentUser()?.access_token ?? null;
  }
}
