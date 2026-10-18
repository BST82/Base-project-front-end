import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { NavigationService } from '../core/services/navigation.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer 
      [style.backgroundColor]="contentService.contents()['footer_bg_color'] || '#133820'"
      class="border-t border-emerald-950/60 dark:border-[#172b1d] text-[#eaf4eb]/85 dark:text-slate-300 text-sm transition-colors duration-200">
      <div class="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-between items-start gap-10 xl:gap-14">
          
          <!-- Column 1: Brand & Philosophy -->
          <div class="max-w-md space-y-4">
            <div class="flex items-center gap-3">
              <div *ngIf="contentService.contents()['brand_logo_url']" class="w-10 h-10 rounded-full overflow-hidden border border-emerald-400/30 shadow-md">
                <img [src]="contentService.contents()['brand_logo_url']" alt="Logo" class="w-full h-full object-cover">
              </div>
              <div *ngIf="!contentService.contents()['brand_logo_url']" class="w-10 h-10 rounded-full bg-emerald-500 text-[#0c1510] font-serif font-black flex items-center justify-center text-xl shadow-md">
                {{ (contentService.contents()['logo_text'] || 'A')[0] }}
              </div>
              <span class="font-serif text-2xl font-bold text-white tracking-tight">
                {{ contentService.contents()['site_name'] || 'Aura Bistro' }}
              </span>
            </div>
            <p class="text-xs leading-relaxed text-[#eaf4eb]/75 dark:text-slate-400">
              {{ contentService.contents()['footer_about_text'] || 'A scratch culinary sanctuary celebrating plant-forward bowls, wild harvests, and sustainable grower partnerships.' }}
            </p>
            
            <!-- Authentic Social Profile Vector Icons -->
            <div class="flex items-center gap-3 pt-2">
              <!-- Instagram -->
              <a 
                [href]="contentService.contents()['social_instagram'] || 'https://instagram.com'" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-full bg-white/10 hover:bg-pink-500/20 text-white/80 hover:text-pink-400 border border-white/10 hover:border-pink-500/40 flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm"
                title="Follow us on Instagram">
                <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <!-- Facebook -->
              <a 
                [href]="contentService.contents()['social_facebook'] || 'https://facebook.com'" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-full bg-white/10 hover:bg-blue-600/20 text-white/80 hover:text-blue-400 border border-white/10 hover:border-blue-500/40 flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm"
                title="Follow us on Facebook">
                <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <!-- X / Twitter -->
              <a 
                [href]="contentService.contents()['social_twitter'] || 'https://twitter.com'" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-full bg-white/10 hover:bg-slate-700/30 text-white/80 hover:text-white border border-white/10 hover:border-white/30 flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm"
                title="Follow us on X (Twitter)">
                <svg class="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <!-- YouTube -->
              <a 
                [href]="contentService.contents()['social_youtube'] || 'https://youtube.com'" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600/20 text-white/80 hover:text-red-400 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm"
                title="Subscribe on YouTube">
                <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Hours & Dining -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-white text-base flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Dining Hours</span>
            </h4>
            <div class="text-xs space-y-1.5 text-[#eaf4eb]/80 dark:text-slate-300">
              <p class="font-bold text-[#4ade80]">Daily Service:</p>
              <p>{{ contentService.contents()['operating_hours'] || 'Mon - Sun: 11:30 AM – 11:00 PM' }}</p>
              <p class="text-[11px] text-[#eaf4eb]/60 dark:text-slate-500 mt-2">Kitchen closes 45 minutes prior to closing time.</p>
            </div>
          </div>

          <!-- Column 3: Location & Contact -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-white text-base">Location & Contact</h4>
            <div class="text-xs space-y-3">
              <p class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="leading-relaxed">{{ contentService.contents()['address'] || '452 Epicurean Avenue, Silicon District, CA 94016' }}</span>
              </p>
              <p class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>{{ contentService.contents()['contact_phone'] || '+1 (555) 789-2341' }}</span>
              </p>
              <p class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>{{ contentService.contents()['contact_email'] || 'reservations@aurabistro.com' }}</span>
              </p>
            </div>
          </div>

          <!-- Column 4: Quick Navigation -->
          <div class="space-y-3">
            <h4 class="font-serif font-bold text-white text-base">Quick Access</h4>
            <ul class="text-xs space-y-2">
              <li *ngFor="let item of navService.navItems()">
                <a 
                  *ngIf="!item.is_external"
                  [routerLink]="item.route" 
                  class="hover:text-[#4ade80] transition-colors">
                  {{ item.label }}
                </a>
                <a 
                  *ngIf="item.is_external"
                  [href]="item.route" 
                  target="_blank" 
                  class="hover:text-[#4ade80] transition-colors">
                  {{ item.label }} ↗
                </a>
              </li>
              <li *ngIf="authService.isAdmin()">
                <a routerLink="/admin" class="hover:text-[#4ade80] transition-colors font-bold text-emerald-400 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Admin Management Center</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-emerald-900/60 dark:border-[#172b1d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#eaf4eb]/60 dark:text-slate-500">
          <p>{{ contentService.contents()['footer_copyright'] || ('© 2026 ' + (contentService.contents()['site_name'] || 'Aura Bistro') + '. All rights reserved.') }}</p>
          <div class="flex gap-6">
            <span>Fresh, Real Food Every Day</span>
            <span>PCI-DSS & SSL Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  contentService = inject(ContentService);
  navService = inject(NavigationService);
  authService = inject(AuthService);
}

