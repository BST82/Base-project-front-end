import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DynamicPageService } from '../core/services/dynamic-page.service';
import { AuthService } from '../core/services/auth.service';
import { DynamicPage, PageHeroSlide, ContentBlockItem } from '../core/models';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-[#f3f4f6] transition-colors duration-200">
      
      <!-- ADMIN QUICK-EDIT FLOATING BAR (If admin logged in) -->
      <div 
        *ngIf="authService.isAdmin() && page()" 
        class="bg-[#133820] text-white py-2 px-4 text-xs font-bold flex items-center justify-between border-b border-emerald-800">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CMS Layout: Viewing Dynamic Page <strong>"{{ page()?.title }}"</strong> (Route: /{{ page()?.slug }})</span>
        </div>
        <a 
          routerLink="/admin" 
          [queryParams]="{ tab: 'dynamic-pages', edit: page()?.id }"
          class="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0c1510] text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm">
          ✏️ Edit Page in Admin
        </a>
      </div>

      <!-- LOADING STATE -->
      <div *ngIf="pageService.loading()" class="py-32 text-center">
        <div class="inline-block w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Loading Curated Layout...</p>
      </div>

      <!-- NOT FOUND STATE -->
      <div *ngIf="!pageService.loading() && notFound()" class="max-w-2xl mx-auto py-32 px-4 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mx-auto flex items-center justify-center text-3xl font-serif">
          🌿
        </div>
        <h1 class="font-serif text-3xl font-bold text-[#133820] dark:text-[#f3f4f6]">Page In Preparation</h1>
        <p class="text-sm text-[#19231a]/70 dark:text-slate-300">
          This bespoke experience is currently being curated by our kitchen and editorial team. Please check back soon or explore our seasonal menu.
        </p>
        <div class="pt-4 flex items-center justify-center gap-3">
          <a routerLink="/" class="px-6 py-2.5 rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#1f3527] hover:bg-white dark:hover:bg-[#142219]">Return Home</a>
          <a routerLink="/menu" class="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#133820] dark:bg-[#22c55e] dark:text-[#0c1510]">Explore Menu</a>
        </div>
      </div>

      <!-- MAIN DYNAMIC PAGE CONTENT -->
      <div *ngIf="!pageService.loading() && page()">

        <!-- =================================================================== -->
        <!-- 1. HERO BANNER SLIDER (MULTI-IMAGE UPLOAD + CAPTIONS) -->
        <!-- =================================================================== -->
        <section 
          *ngIf="page()?.hero_slides && page()!.hero_slides.length > 0"
          class="relative min-h-[75vh] lg:min-h-[85vh] flex flex-col justify-between items-center text-center overflow-hidden bg-[#181109]">
          
          <!-- Active Slide Image -->
          <div class="absolute inset-0 z-0">
            <img 
              [src]="currentSlide()?.image_url" 
              [alt]="currentSlide()?.title || page()?.title"
              class="w-full h-full object-cover object-center filter brightness-[0.76] contrast-[1.05] transition-all duration-1000 transform scale-105">
            
            <!-- Atmospheric Dark Gradients -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/85"></div>
            <div class="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none"></div>
          </div>

          <!-- Slide Controls (If > 1 slide) -->
          <button 
            *ngIf="page()!.hero_slides.length > 1"
            (click)="prevSlide()"
            aria-label="Previous Slide"
            class="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
            ←
          </button>
          <button 
            *ngIf="page()!.hero_slides.length > 1"
            (click)="nextSlide()"
            aria-label="Next Slide"
            class="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
            →
          </button>

          <!-- Top Badge -->
          <div class="pt-10 z-10 w-full px-4 sm:px-6">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-amber-200 text-xs tracking-wider uppercase font-bold shadow-xl">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{{ currentSlide()?.badge_text || currentSlide()?.caption || 'CURATED EXPERIENCES • AURA BISTRO' }}</span>
            </div>
          </div>

          <!-- Slide Typography & Call to Actions -->
          <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center space-y-4">
            
            <!-- Headline -->
            <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)] leading-[1.02]">
              {{ currentSlide()?.title || page()?.title }}
            </h1>

            <!-- Decorative Wing Ribbon -->
            <div class="flex items-center justify-center gap-3 w-full max-w-md pt-1">
              <div class="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-300"></div>
              <span class="font-serif text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-amber-300 drop-shadow">
                {{ currentSlide()?.caption || 'ARTISAN GASTRONOMY' }}
              </span>
              <div class="h-[2px] flex-1 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-300"></div>
            </div>

            <!-- Subtitle -->
            <p class="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-md pt-1">
              {{ currentSlide()?.subtitle || page()?.subtitle || page()?.meta_description }}
            </p>

            <!-- Dual Action Buttons -->
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a 
                [routerLink]="currentSlide()?.button_primary_link || '/reserve'" 
                class="w-full sm:w-auto px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-[#133820] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 shadow-2xl transition-all transform hover:-translate-y-0.5 text-center border border-amber-200">
                {{ currentSlide()?.button_primary_text || 'Make a Reservation' }}
              </a>

              <a 
                *ngIf="currentSlide()?.button_secondary_text"
                [routerLink]="currentSlide()?.button_secondary_link || '/menu'"
                class="w-full sm:w-auto px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/30 hover:border-white shadow-xl transition-all transform hover:-translate-y-0.5 text-center">
                {{ currentSlide()?.button_secondary_text }}
              </a>
            </div>

            <!-- Slider Dots -->
            <div *ngIf="page()!.hero_slides.length > 1" class="pt-4 flex items-center gap-2">
              <button 
                *ngFor="let s of page()!.hero_slides; let i = index"
                (click)="goToSlide(i)"
                [class]="slideIndex() === i ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/80'"
                class="h-2 rounded-full transition-all duration-300"
                [title]="'Slide ' + (i + 1)">
              </button>
            </div>

          </div>

          <!-- Bottom Parchment Bar -->
          <div class="w-full relative z-10 h-8 sm:h-10 bg-[#c8a176] dark:bg-[#18271e] opacity-95 flex items-center justify-center border-t border-[#b68f64]/40 shadow-inner px-4">
            <div class="flex items-center gap-6 sm:gap-10 text-[10px] sm:text-xs font-mono tracking-widest text-[#422d17] dark:text-[#86efac] uppercase font-bold overflow-x-auto whitespace-nowrap">
              <span>🌾 Seed-To-Table Integrity</span>
              <span>•</span>
              <span>🔥 Hearth & Woodfired Cooking</span>
              <span>•</span>
              <span>🍷 Natural & Biodynamic Cellar</span>
            </div>
          </div>

        </section>


        <!-- =================================================================== -->
        <!-- 2. MODULAR CONTENT BLOCKS (CONFIGURABLE & CMS MANAGED) -->
        <!-- =================================================================== -->
        <div class="space-y-16 py-16">
          <div *ngFor="let block of page()?.content_blocks" [ngSwitch]="block.block_type">

            <!-- TYPE A: RICH TEXT EDITORIAL STORY BLOCK -->
            <section *ngSwitchCase="'rich_text'" class="max-w-4xl mx-auto px-4 sm:px-6">
              <div class="text-center space-y-4">
                <span *ngIf="block.badge" class="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  {{ block.badge }}
                </span>
                <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#133820] dark:text-[#f3f4f6]">
                  {{ block.heading }}
                </h2>
                <p *ngIf="block.subheading" class="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
                  {{ block.subheading }}
                </p>
                <div 
                  *ngIf="block.body"
                  class="prose prose-emerald dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-[#19231a]/85 dark:text-slate-300 pt-4"
                  [innerHTML]="block.body">
                </div>
              </div>
            </section>

            <!-- TYPE B: SPLIT IMAGE & CONTENT BLOCK -->
            <section *ngSwitchCase="'split_content'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white dark:bg-[#142219] p-8 sm:p-12 rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
                
                <!-- Left: Content -->
                <div class="space-y-4">
                  <span *ngIf="block.badge" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                    {{ block.badge }}
                  </span>
                  <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#133820] dark:text-[#f3f4f6] leading-tight">
                    {{ block.heading }}
                  </h2>
                  <p *ngIf="block.subheading" class="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                    {{ block.subheading }}
                  </p>
                  <div 
                    *ngIf="block.body"
                    class="text-xs sm:text-sm text-[#19231a]/80 dark:text-slate-300 leading-relaxed space-y-3"
                    [innerHTML]="block.body">
                  </div>
                  <div *ngIf="block.button_text" class="pt-4">
                    <a 
                      [routerLink]="block.button_link || '/reserve'" 
                      class="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all">
                      <span>{{ block.button_text }}</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                <!-- Right: Image -->
                <div class="aspect-[16/11] rounded-2xl overflow-hidden shadow-xl bg-slate-900 group">
                  <img 
                    [src]="block.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'" 
                    [alt]="block.heading"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                </div>

              </div>
            </section>

            <!-- TYPE C: FEATURE GRID / AMENITIES CARDS -->
            <section *ngSwitchCase="'feature_grid'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span *ngIf="block.badge" class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
                  {{ block.badge }}
                </span>
                <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#133820] dark:text-[#f3f4f6]">
                  {{ block.heading }}
                </h2>
                <p *ngIf="block.subheading" class="text-xs sm:text-sm text-slate-500">
                  {{ block.subheading }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                  *ngFor="let item of block.items"
                  class="p-8 rounded-3xl bg-white dark:bg-[#142219] border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm hover:shadow-md transition-all space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-2xl">
                    {{ item.icon || '✦' }}
                  </div>
                  <h3 class="font-serif text-lg font-bold text-[#133820] dark:text-slate-100">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-[#19231a]/70 dark:text-slate-400 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </section>

            <!-- TYPE D: HIGH IMPACT CTA BANNER -->
            <section *ngSwitchCase="'cta_banner'" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="bg-gradient-to-r from-[#133820] to-[#1c532f] dark:from-[#0d2215] dark:to-[#173a24] text-white p-10 sm:p-14 rounded-3xl border border-emerald-900/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div class="space-y-2 max-w-xl">
                  <span *ngIf="block.badge" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {{ block.badge }}
                  </span>
                  <h2 class="font-serif text-3xl sm:text-4xl font-black tracking-tight">
                    {{ block.heading }}
                  </h2>
                  <p *ngIf="block.subheading" class="text-xs sm:text-sm text-emerald-100/80">
                    {{ block.subheading }}
                  </p>
                </div>

                <div>
                  <a 
                    [routerLink]="block.button_link || '/reserve'" 
                    class="px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-[#133820] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 shadow-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap border border-amber-200">
                    {{ block.button_text || 'Reserve Now' }}
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>

    </div>
  `
})
export class DynamicPageComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  pageService = inject(DynamicPageService);
  authService = inject(AuthService);

  readonly page = signal<DynamicPage | null>(null);
  readonly notFound = signal<boolean>(false);
  readonly slideIndex = signal<number>(0);
  private timer: any = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPage(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopSlideTimer();
  }

  loadPage(slug: string): void {
    this.notFound.set(false);
    this.pageService.getPageBySlug(slug).subscribe({
      next: (data) => {
        this.page.set(data);
        this.slideIndex.set(0);
        this.startSlideTimer();
      },
      error: () => {
        this.page.set(null);
        this.notFound.set(true);
      }
    });
  }

  currentSlide(): PageHeroSlide | null {
    const slides = this.page()?.hero_slides;
    if (!slides || slides.length === 0) return null;
    return slides[this.slideIndex() % slides.length];
  }

  nextSlide(): void {
    const slides = this.page()?.hero_slides;
    if (slides && slides.length > 1) {
      this.slideIndex.set((this.slideIndex() + 1) % slides.length);
    }
  }

  prevSlide(): void {
    const slides = this.page()?.hero_slides;
    if (slides && slides.length > 1) {
      this.slideIndex.set((this.slideIndex() - 1 + slides.length) % slides.length);
    }
  }

  goToSlide(idx: number): void {
    this.slideIndex.set(idx);
    this.restartSlideTimer();
  }

  private startSlideTimer(): void {
    this.stopSlideTimer();
    this.timer = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  private stopSlideTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private restartSlideTimer(): void {
    this.stopSlideTimer();
    this.startSlideTimer();
  }
}
