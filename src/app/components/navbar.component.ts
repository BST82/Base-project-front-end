import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { NavigationService } from '../core/services/navigation.service';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Top Sweetgreen-Style Announcement Banner -->
    <div 
      *ngIf="contentService.contents()['announcement_banner']" 
      class="bg-[#133820] dark:bg-[#082012] text-[#eaf4eb] text-xs py-2.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2 border-b border-emerald-900/40">
      <span class="inline-block w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
      <span>{{ contentService.contents()['announcement_banner'] }}</span>
    </div>

    <!-- Main Navigation Bar -->
    <header class="sticky top-0 z-40 bg-[#faf8f5]/95 dark:bg-[#0c1510]/95 backdrop-blur-md border-b border-[#e8e4dc] dark:border-[#1f3527] transition-colors duration-200">
      <div class="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-4 xl:gap-8">
        
        <!-- Brand Logo inspired by Sweetgreen -->
        <a routerLink="/" class="flex items-center gap-3 group shrink-0 mr-2 xl:mr-4">
          <!-- Dynamic Logo Image or Monogram -->
          <div *ngIf="contentService.contents()['brand_logo_url']" class="w-10 h-10 rounded-full overflow-hidden border border-emerald-800/20 shadow-md shrink-0">
            <img [src]="contentService.contents()['brand_logo_url']" alt="Logo" class="w-full h-full object-cover">
          </div>
          <div *ngIf="!contentService.contents()['brand_logo_url']" class="w-10 h-10 rounded-full bg-[#133820] dark:bg-[#22c55e] flex items-center justify-center text-white dark:text-[#0c1510] font-serif font-black text-xl shadow-md transition-transform group-hover:scale-105 shrink-0">
            {{ (contentService.contents()['logo_text'] || 'A')[0] }}
          </div>
          <div class="flex flex-col shrink-0">
            <span class="font-serif text-xl xl:text-2xl font-bold tracking-tight text-[#133820] dark:text-[#f3f4f6] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              {{ contentService.contents()['logo_text'] || 'AURA' }}
            </span>
            <span class="text-[9px] uppercase tracking-widest text-emerald-800 dark:text-emerald-400 -mt-1 font-bold whitespace-nowrap">
              Artisan Kitchen
            </span>
          </div>
        </a>

        <!-- Desktop Navigation Links (Dynamic from NavigationService) -->
        <nav class="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-6 text-xs xl:text-[13px] 2xl:text-sm font-semibold text-[#19231a]/80 dark:text-slate-300">
          <ng-container *ngFor="let item of navService.navItems()">
            <a 
              *ngIf="!item.is_external"
              [routerLink]="item.route" 
              routerLinkActive="text-[#133820] dark:text-[#4ade80] !font-bold" 
              [routerLinkActiveOptions]="{exact: item.route === '/'}" 
              class="whitespace-nowrap px-1 py-1 hover:text-[#133820] dark:hover:text-[#4ade80] transition-colors">
              {{ item.label }}
            </a>
            <a 
              *ngIf="item.is_external"
              [href]="item.route" 
              target="_blank" 
              rel="noopener noreferrer"
              class="whitespace-nowrap px-1 py-1 hover:text-[#133820] dark:hover:text-[#4ade80] transition-colors flex items-center gap-1">
              <span>{{ item.label }}</span>
              <span class="text-[10px]">↗</span>
            </a>
          </ng-container>

          <!-- Admin Dashboard Link (ONLY shown when user is logged in AND has ADMIN role) -->
          <a 
            *ngIf="authService.isAdmin()"
            routerLink="/admin" 
            routerLinkActive="bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510]"
            class="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#133820] dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-600/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all text-xs font-bold shrink-0 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Admin Center</span>
          </a>
        </nav>

        <!-- Right Controls: Auth, Theme Toggle & Actions -->
        <div class="flex items-center gap-2 xl:gap-3 shrink-0">
          
          <!-- AUTHENTICATION SECTION (DESKTOP) -->
          <!-- State A: Not Logged In -> Login & Sign Up buttons -->
          <div *ngIf="!authService.isLoggedIn()" class="hidden sm:flex items-center gap-2 shrink-0">
            <button 
              (click)="openLogin.emit()"
              class="whitespace-nowrap px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-full font-bold text-xs text-[#133820] dark:text-[#f3f4f6] hover:bg-black/5 dark:hover:bg-white/5 border border-[#e2ded6] dark:border-[#1f3527] transition-all">
              Sign In
            </button>
            <button 
              (click)="openSignup.emit()"
              class="whitespace-nowrap px-3.5 py-1.5 xl:px-4 xl:py-2 rounded-full font-bold text-xs uppercase tracking-wider text-emerald-900 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700/60 shadow-sm transition-all">
              Sign Up
            </button>
          </div>

          <!-- State B: Logged In -> User Profile Chip & Sign Out -->
          <div *ngIf="authService.isLoggedIn()" class="hidden sm:flex items-center gap-2 shrink-0">
            <!-- User Profile Pill -->
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4ede0] dark:bg-[#17271d] border border-[#e2ded6] dark:border-[#22382a] text-xs shadow-sm whitespace-nowrap">
              <span class="w-6 h-6 rounded-full bg-[#133820] dark:bg-[#22c55e] text-white dark:text-[#0c1510] flex items-center justify-center font-bold text-[11px]">
                {{ (authService.currentUser()?.name || 'U')[0].toUpperCase() }}
              </span>
              <span class="font-bold text-[#133820] dark:text-[#f3f4f6] max-w-[110px] truncate">
                {{ authService.currentUser()?.name }}
              </span>
              <!-- Role Badge -->
              <span 
                [class]="authService.isAdmin() ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700' : 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'"
                class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase border">
                {{ authService.isAdmin() ? 'Admin' : 'User' }}
              </span>
            </div>

            <!-- Sign Out Button -->
            <button 
              (click)="logout()"
              title="Sign Out of Account"
              class="whitespace-nowrap px-3 py-1.5 rounded-full font-bold text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 transition-all flex items-center gap-1">
              <span>Sign Out</span>
            </button>
          </div>

          <!-- Light / Dark Theme Switcher Button -->
          <button 
            (click)="themeService.toggleTheme()" 
            [title]="themeService.isDark() ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
            class="p-2.5 rounded-full bg-[#f4ede0] dark:bg-[#17271d] text-[#133820] dark:text-[#86efac] border border-[#e2ded6] dark:border-[#22382a] hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center shadow-sm shrink-0">
            <span *ngIf="!themeService.isDark()">🌙</span>
            <span *ngIf="themeService.isDark()">☀️</span>
          </button>

          <!-- Book Table CTA -->
          <a 
            routerLink="/reserve"
            class="hidden lg:inline-flex whitespace-nowrap items-center gap-2 px-4 py-2 xl:px-5 xl:py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0">
            <span>Reserve Table</span>
          </a>

          <!-- Mobile Hamburger Menu Button -->
          <button 
            (click)="mobileMenuOpen.set(!mobileMenuOpen())"
            aria-label="Toggle Navigation Menu"
            class="lg:hidden p-2 rounded-xl text-[#133820] dark:text-[#f3f4f6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <svg *ngIf="!mobileMenuOpen()" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg *ngIf="mobileMenuOpen()" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div 
        *ngIf="mobileMenuOpen()" 
        class="lg:hidden bg-[#faf8f5] dark:bg-[#0c1510] border-b border-[#e8e4dc] dark:border-[#1f3527] px-6 py-5 space-y-4 shadow-xl animate-fade-in">
        
        <!-- Mobile Auth State Section -->
        <div class="pb-3 border-b border-black/5 dark:border-white/5">
          <!-- When NOT logged in -->
          <div *ngIf="!authService.isLoggedIn()" class="grid grid-cols-2 gap-2">
            <button 
              (click)="openLogin.emit(); mobileMenuOpen.set(false)"
              class="w-full py-2.5 text-center rounded-xl font-bold text-xs text-[#133820] dark:text-[#f3f4f6] bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] shadow-sm">
              Sign In
            </button>
            <button 
              (click)="openSignup.emit(); mobileMenuOpen.set(false)"
              class="w-full py-2.5 text-center rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-950 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
              Sign Up
            </button>
          </div>

          <!-- When Logged In -->
          <div *ngIf="authService.isLoggedIn()" class="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#142219] border border-[#e8e4dc] dark:border-[#1f3527]">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-[#133820] dark:bg-[#22c55e] text-white dark:text-[#0c1510] flex items-center justify-center font-bold text-xs">
                {{ (authService.currentUser()?.name || 'U')[0].toUpperCase() }}
              </span>
              <div>
                <p class="text-xs font-bold text-[#133820] dark:text-[#f3f4f6] leading-tight">
                  {{ authService.currentUser()?.name }}
                </p>
                <span 
                  [class]="authService.isAdmin() ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-800 dark:text-emerald-400'"
                  class="text-[10px] font-black uppercase">
                  {{ authService.isAdmin() ? '👑 Administrator' : '👤 Diner User' }}
                </span>
              </div>
            </div>
            <button 
              (click)="logout(); mobileMenuOpen.set(false)" 
              class="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 border border-red-200">
              Sign Out
            </button>
          </div>
        </div>

        <nav class="flex flex-col space-y-2 font-semibold text-sm text-[#19231a] dark:text-[#f3f4f6]">
          <ng-container *ngFor="let item of navService.navItems()">
            <a 
              *ngIf="!item.is_external"
              (click)="mobileMenuOpen.set(false)" 
              [routerLink]="item.route" 
              class="py-2 border-b border-black/5 dark:border-white/5 hover:text-emerald-700">
              {{ item.label }}
            </a>
            <a 
              *ngIf="item.is_external"
              [href]="item.route" 
              target="_blank" 
              class="py-2 border-b border-black/5 dark:border-white/5 hover:text-emerald-700 flex items-center justify-between">
              <span>{{ item.label }}</span>
              <span>↗</span>
            </a>
          </ng-container>
          
          <!-- Admin Link in Mobile Drawer (ONLY for ADMIN) -->
          <a 
            *ngIf="authService.isAdmin()"
            (click)="mobileMenuOpen.set(false)" 
            routerLink="/admin" 
            class="py-2 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-between">
            <span>👑 Admin Control Center</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">Admin</span>
          </a>
        </nav>

        <div class="pt-2 flex items-center justify-between">
          <button 
            (click)="themeService.toggleTheme()" 
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f4ede0] dark:bg-[#17271d] text-xs font-semibold text-[#133820] dark:text-[#86efac]">
            <span>{{ themeService.isDark() ? '☀️ Switch to Light' : '🌙 Switch to Dark' }}</span>
          </button>
          
          <a 
            (click)="mobileMenuOpen.set(false)"
            routerLink="/reserve"
            class="px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] dark:bg-[#22c55e] dark:text-[#0c1510]">
            Reserve Table
          </a>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Output() openLogin = new EventEmitter<void>();
  @Output() openSignup = new EventEmitter<void>();

  contentService = inject(ContentService);
  navService = inject(NavigationService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  router = inject(Router);

  readonly mobileMenuOpen = signal<boolean>(false);

  logout(): void {
    this.authService.logout();
    this.toastService.info('You have been signed out.');
    if (this.router.url.startsWith('/admin')) {
      this.router.navigate(['/']);
    }
  }
}


