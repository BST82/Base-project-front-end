import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';
import { LoginModalComponent } from './components/login-modal.component';
import { GlobalLoaderComponent } from './components/global-loader.component';
import { ToastContainerComponent } from './components/toast-container.component';
import { ConfirmDialogComponent } from './components/confirm-dialog.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
    LoginModalComponent,
    GlobalLoaderComponent,
    ToastContainerComponent,
    ConfirmDialogComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-[#f3f4f6] font-sans transition-colors duration-200">
      <!-- Global Top Loading Progress Bar & Sync Indicator -->
      <app-global-loader></app-global-loader>

      <!-- Navbar (Inherited Layout) -->
      <app-navbar 
        (openLogin)="openAuthModal('login')" 
        (openSignup)="openAuthModal('register')">
      </app-navbar>

      <!-- Main Body Router Outlet -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer (Inherited Layout) -->
      <app-footer></app-footer>

      <!-- Global Auth Modal -->
      <app-login-modal 
        *ngIf="isLoginModalOpen" 
        [initialMode]="authModalMode"
        (close)="isLoginModalOpen = false">
      </app-login-modal>

      <!-- Centralized Sonner-Style Toast Notifications -->
      <app-toast-container></app-toast-container>

      <!-- Centralized Modal Confirmation Dialog (Replaces native alerts/confirms) -->
      <app-confirm-dialog></app-confirm-dialog>
    </div>
  `
})
export class AppComponent {
  isLoginModalOpen = false;
  authModalMode: 'login' | 'register' = 'login';
  themeService = inject(ThemeService); // Initializes light/dark theme preference

  openAuthModal(mode: 'login' | 'register'): void {
    this.authModalMode = mode;
    this.isLoginModalOpen = true;
  }
}

