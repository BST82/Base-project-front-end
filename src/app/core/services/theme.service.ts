import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'aura_theme_mode';
  
  // Default is light theme as requested
  readonly currentTheme = signal<'light' | 'dark'>(this.getInitialTheme());
  readonly isDark = computed(() => this.currentTheme() === 'dark');

  constructor() {
    this.applyTheme(this.currentTheme());
  }

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

  private getInitialTheme(): 'light' | 'dark' {
    try {
      const storage = this.getStorage();
      if (storage) {
        const saved = storage.getItem(this.storageKey);
        if (saved === 'dark' || saved === 'light') {
          return saved;
        }
      }
    } catch {
      // fallback
    }
    // Default to light theme
    return 'light';
  }

  toggleTheme(): void {
    const next = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
    try {
      const storage = this.getStorage();
      storage?.setItem(this.storageKey, theme);
    } catch {
      // ignore
    }
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}
