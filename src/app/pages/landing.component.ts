import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { MenuService } from '../core/services/menu.service';
import { ReviewService } from '../core/services/review.service';
import { BannerSlideService } from '../core/services/banner-slide.service';
import { BranchService } from '../core/services/branch.service';
import { StoryService } from '../core/services/story.service';
import { BannerSlide } from '../core/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="relative overflow-hidden">
      
      <!-- =================================================================== -->
      <!-- DYNAMIC HERO BANNER SLIDER (OVERHEAD TABLETOP & HARVEST FEASTS) -->
      <!-- =================================================================== -->
      <section class="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between items-center text-center overflow-hidden bg-[#1a120b]">
        
        <!-- Active Slide Background with Smooth Transition -->
        <div class="absolute inset-0 z-0">
          <img 
            [src]="currentSlide()?.image_url || '/hero_table_banner.jpg'" 
            [alt]="currentSlide()?.title || 'Artisanal Feast Tabletop Spread'" 
            class="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08] transform scale-105 transition-all duration-1000">
          
          <!-- Rich Warm Vignette & Gradient Overlays for High Legibility -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/85"></div>
          <div class="absolute inset-0 bg-radial-gradient from-transparent via-black/25 to-black/75 pointer-events-none"></div>
        </div>

        <!-- Slider Navigation Arrows (shown if > 1 slide) -->
        <button 
          *ngIf="bannerService.slides().length > 1"
          (click)="prevSlide()"
          aria-label="Previous Slide"
          class="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
          ←
        </button>
        <button 
          *ngIf="bannerService.slides().length > 1"
          (click)="nextSlide()"
          aria-label="Next Slide"
          class="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl">
          →
        </button>

        <!-- Top Spacing & Dynamic Capsule Badge -->
        <div class="pt-8 sm:pt-12 z-10 w-full px-4 sm:px-6">
          <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-amber-200 text-xs tracking-wider uppercase font-bold shadow-xl">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>{{ currentSlide()?.badge_text || 'Scratch Kitchen • Direct Farm Partnerships' }}</span>
          </div>
        </div>

        <!-- Center Iconic Vintage Stamp & Dynamic Slider Typography -->
        <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center space-y-4">
          
          <!-- Circular Butcher & Bee Style Badge -->
          <div class="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#d97706] text-white p-1 shadow-2xl flex items-center justify-center border-2 border-amber-300/80 transform hover:rotate-6 transition-transform">
            <div class="w-full h-full rounded-full border border-dashed border-amber-200/90 flex flex-col items-center justify-center p-1 text-center">
              <span class="text-[9px] uppercase tracking-widest font-bold">EST. 2026</span>
              <span class="font-serif font-black text-xs sm:text-sm tracking-tight leading-none text-white">
                {{ (contentService.contents()['logo_text'] || 'AURA') }}
              </span>
              <span class="text-[8px] uppercase tracking-wider font-semibold opacity-90">& BISTRO</span>
            </div>
          </div>

          <!-- Vintage Slanted Script Heading -->
          <div class="font-script text-3xl sm:text-5xl text-amber-200 -rotate-3 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] -mb-2 sm:-mb-3">
            Honest to
          </div>

          <!-- Massive Headline from Active Slide or CMS Content -->
          <h1 class="font-serif text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)] leading-[0.98]">
            {{ currentSlide()?.title || contentService.contents()['hero_title'] || 'GOODNESS EATS' }}
          </h1>

          <!-- Ribbon Banner Underline with Decorative Wing Flourishes -->
          <div class="flex items-center justify-center gap-3 w-full max-w-md pt-1">
            <div class="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-400/80 to-amber-300"></div>
            <span class="font-serif text-xs sm:text-base font-black uppercase tracking-[0.3em] text-amber-300 drop-shadow">
              ARTISAN GASTRONOMY
            </span>
            <div class="h-[2px] flex-1 bg-gradient-to-l from-transparent via-amber-400/80 to-amber-300"></div>
          </div>

          <!-- Dynamic Subtitle from Active Slide or CMS Content -->
          <p class="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-md pt-1">
            {{ currentSlide()?.subtitle || contentService.contents()['hero_subtitle'] || 'Experience an unforgettable dining journey crafted with farm-to-table ingredients, authentic woodfired flavors, and world-class culinary finesse.' }}
          </p>

          <!-- Dual Call to Action Buttons -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a 
              [routerLink]="currentSlide()?.button_primary_link || currentSlide()?.cta_link || '/reserve'" 
              class="w-full sm:w-auto px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-[#133820] bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 shadow-2xl hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5 text-center border border-amber-200">
              {{ currentSlide()?.button_primary_text || currentSlide()?.cta_text || 'Make a Reservation' }}
            </a>
            <a 
              routerLink="/menu" 
              class="w-full sm:w-auto px-9 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/30 hover:border-white shadow-xl transition-all transform hover:-translate-y-0.5 text-center">
              Explore Menu & Recipes
            </a>
          </div>

          <!-- Quick Operating Hours Badge -->
          <div class="pt-2 flex items-center justify-center gap-2 text-xs text-slate-300 drop-shadow">
            <span class="text-amber-400">🕒</span>
            <span>Today's Hours:</span>
            <span class="text-white font-semibold">{{ contentService.contents()['operating_hours'] || '11:30 AM – 11:00 PM' }}</span>
          </div>

          <!-- Slide Dot Indicators -->
          <div *ngIf="bannerService.slides().length > 1" class="pt-4 flex items-center gap-2">
            <button 
              *ngFor="let s of bannerService.slides(); let i = index"
              (click)="goToSlide(i)"
              [class]="currentSlideIndex() === i ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/80'"
              class="h-2 rounded-full transition-all duration-300"
              [title]="'Slide ' + (i + 1)">
            </button>
          </div>
        </div>

        <!-- Bottom Parchment Paper Transition Strip (Butcher & Bee Style) -->
        <div class="w-full relative z-10">
          <div class="h-8 sm:h-10 w-full bg-[#c8a176] dark:bg-[#18271e] opacity-95 flex items-center justify-center border-t border-[#b68f64]/40 shadow-inner px-4">
            <div class="flex items-center gap-6 sm:gap-10 text-[10px] sm:text-xs font-mono tracking-widest text-[#422d17] dark:text-[#86efac] uppercase font-bold overflow-x-auto whitespace-nowrap">
              <span>🌾 100% Certified Organic</span>
              <span>•</span>
              <span>🔥 Scratch Cooked In-House</span>
              <span>•</span>
              <span>🥬 Direct Farm Partners</span>
              <span>•</span>
              <span>🫒 Zero Seed Oils & Additives</span>
            </div>
          </div>
        </div>

      </section>

      <!-- =================================================================== -->
      <!-- TOP RECIPES & SEASONAL SELECTIONS -->
      <!-- =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#e8e4dc] dark:border-[#1f3527]">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">Handcrafted Daily</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-1">Chef's Signature Recipes</h2>
          </div>
          <a routerLink="/menu" class="mt-4 md:mt-0 text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 group">
            <span>Explore Full Menu</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            *ngFor="let item of menuService.topRecipes().slice(0, 3)" 
            class="bg-white dark:bg-[#142219] rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] hover:border-emerald-600/40 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            
            <!-- Dish Photo -->
            <div class="relative h-64 overflow-hidden bg-[#f4ede0] dark:bg-[#0c1510]">
              <img 
                [src]="item.photo_url || 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80'" 
                [alt]="item.name" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              
              <!-- Badges -->
              <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                <span *ngIf="item.is_chef_special" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] shadow-sm">
                  Chef's Special
                </span>
                <span *ngIf="item.is_top_recipe" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#eaf4eb] text-emerald-900 border border-emerald-300/60 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-sm">
                  Top Recipe
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-start justify-between gap-4">
                  <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {{ item.name }}
                  </h3>
                  <span class="font-serif text-xl font-bold text-[#133820] dark:text-[#4ade80] whitespace-nowrap">
                    {{ contentService.contents()['currency_symbol'] || '$' }}{{ item.price | number:'1.2-2' }}
                  </span>
                </div>
                <p class="text-xs text-[#19231a]/70 dark:text-slate-300 mt-2 leading-relaxed">
                  {{ item.description }}
                </p>
              </div>

              <div class="pt-4 border-t border-[#f4ede0] dark:border-[#1f3527] flex items-center justify-between">
                <span class="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                  {{ item.tags || 'Artisan Dish' }}
                </span>
                <a routerLink="/reserve" class="text-xs font-bold text-[#133820] dark:text-[#4ade80] hover:underline">
                  Reserve Table →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =================================================================== -->
      <!-- MULTI-BRANCH STORE LOCATOR HIGHLIGHT -->
      <!-- =================================================================== -->
      <section class="bg-[#f5f0e6] dark:bg-[#111d15] border-y border-[#e8e4dc] dark:border-[#1f3527] py-20 transition-colors">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
                Find Your Table
              </span>
              <h2 class="font-serif text-3xl sm:text-5xl font-bold text-[#133820] dark:text-[#f3f4f6] leading-tight">
                Bringing Farm Fresh Dining to Your Neighborhood
              </h2>
              <p class="text-sm text-[#19231a]/80 dark:text-slate-300 leading-relaxed">
                Explore our locations across the nation with real-time table availability, directions, and direct online reservations.
              </p>

              <!-- Featured City Badges -->
              <div class="flex flex-wrap gap-2 pt-2">
                <a 
                  *ngFor="let city of branchService.cities()"
                  routerLink="/locations"
                  class="px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-[#142219] text-[#133820] dark:text-emerald-300 border border-[#e8e4dc] dark:border-[#1f3527] hover:border-emerald-600 transition-colors shadow-sm">
                  📍 {{ city }}
                </a>
              </div>


              <div class="pt-4">
                <a 
                  routerLink="/locations" 
                  class="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all">
                  <span>Open Interactive Map & Branches</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            <div class="relative">
              <div class="aspect-[16/10] rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] shadow-xl bg-slate-900 group">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80" 
                  alt="Restaurant Dining Interior" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div class="text-white space-y-1">
                    <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Multi-Branch Network</span>
                    <p class="text-sm font-semibold">Reserve your favorite dining table in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =================================================================== -->
      <!-- EDITORIAL: "OUR STORIES" HARVEST JOURNAL PREVIEW -->
      <!-- =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">
              Harvest Journal
            </span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-1">
              Stories from the Farm & Hearth
            </h2>
          </div>
          <a routerLink="/stories" class="mt-4 md:mt-0 text-sm font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 group">
            <span>Read All Stories</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article 
            *ngFor="let story of storyService.stories().slice(0, 3)"
            class="bg-white dark:bg-[#142219] rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col group">
            
            <div class="relative h-48 overflow-hidden bg-slate-100">
              <img 
                [src]="story.cover_image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'" 
                [alt]="story.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#133820] text-white">
                {{ story.category }}
              </span>
            </div>

            <div class="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[11px] text-slate-400">{{ (story.created_at || story.published_at) | date:'mediumDate' }}</span>
                <h3 class="font-serif text-lg font-bold text-[#133820] dark:text-slate-100 group-hover:text-emerald-700 transition-colors mt-1">
                  {{ story.title }}
                </h3>
                <p class="text-xs text-[#19231a]/70 dark:text-slate-300 mt-2 line-clamp-2">
                  {{ story.excerpt }}
                </p>
              </div>

              <div class="pt-3 border-t border-[#f4ede0] dark:border-[#1f3527]">
                <a routerLink="/stories" class="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline">
                  Read Article →
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- =================================================================== -->
      <!-- TESTIMONIALS & COMMUNITY VOICES -->
      <!-- =================================================================== -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#e8e4dc] dark:border-[#1f3527]">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">Community Voices</span>
          <h2 class="font-serif text-3xl sm:text-4xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-1">What Diners Are Saying</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            *ngFor="let review of reviewService.reviews().slice(0, 3)" 
            class="bg-white dark:bg-[#142219] rounded-3xl p-6 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex text-amber-500 text-sm">
                <span *ngFor="let star of [1,2,3,4,5]">★</span>
              </div>
              <p class="text-xs text-[#19231a]/80 dark:text-slate-300 italic leading-relaxed">
                "{{ review.comment }}"
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-[#f4ede0] dark:border-[#1f3527] flex items-center justify-between text-xs">
              <span class="font-bold text-[#133820] dark:text-slate-200">{{ review.customer_name }}</span>
              <span class="text-slate-500 dark:text-slate-400">{{ review.created_at | date:'mediumDate' }}</span>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center">
          <a routerLink="/reviews" class="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline">
            Read all customer stories & feedback →
          </a>
        </div>
      </section>

    </div>
  `
})
export class LandingComponent implements OnInit, OnDestroy {
  contentService = inject(ContentService);
  menuService = inject(MenuService);
  reviewService = inject(ReviewService);
  bannerService = inject(BannerSlideService);
  branchService = inject(BranchService);
  storyService = inject(StoryService);

  readonly currentSlideIndex = signal<number>(0);
  private slideInterval: any = null;

  ngOnInit(): void {
    this.contentService.loadContent().subscribe();
    this.menuService.loadItems().subscribe();
    this.reviewService.loadApprovedReviews().subscribe();
    this.branchService.loadBranches().subscribe();
    this.branchService.loadCities().subscribe();
    this.storyService.loadPublishedStories().subscribe();

    this.startSlideTimer();
  }

  ngOnDestroy(): void {
    this.stopSlideTimer();
  }

  currentSlide(): BannerSlide | null {
    const list = this.bannerService.slides();
    if (list.length === 0) return null;
    return list[this.currentSlideIndex() % list.length];
  }

  nextSlide(): void {
    const list = this.bannerService.slides();
    if (list.length > 1) {
      this.currentSlideIndex.set((this.currentSlideIndex() + 1) % list.length);
    }
  }

  prevSlide(): void {
    const list = this.bannerService.slides();
    if (list.length > 1) {
      this.currentSlideIndex.set((this.currentSlideIndex() - 1 + list.length) % list.length);
    }
  }

  goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    this.restartSlideTimer();
  }

  private startSlideTimer(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  private stopSlideTimer(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  private restartSlideTimer(): void {
    this.stopSlideTimer();
    this.startSlideTimer();
  }
}
