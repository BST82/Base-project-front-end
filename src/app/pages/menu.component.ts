import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../core/services/menu.service';
import { ContentService } from '../core/services/content.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <!-- Page Header: Sweetgreen Style -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-bold tracking-widest text-emerald-800 dark:text-emerald-400 uppercase">Scratch Cooking</span>
        <h1 class="font-serif text-4xl sm:text-5xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-2">The Harvest Menu</h1>
        <p class="text-sm text-[#19231a]/70 dark:text-slate-300 mt-3">
          Explore handcrafted artisan bowls, woodfired mains, and seasonal plates forged from farm-fresh harvests.
        </p>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="mb-12 space-y-6">
        <!-- Search and Quick Filter Toggles -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="relative w-full md:w-96">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onFilterChange()"
              placeholder="Search recipes, ingredients, tags..."
              class="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#142219] border border-[#e8e4dc] dark:border-[#1f3527] rounded-full text-[#19231a] dark:text-[#f3f4f6] placeholder-slate-400 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400 text-sm shadow-sm transition-colors">
            <span class="absolute left-4 top-3.5 text-slate-400 text-sm">🔍</span>
          </div>

          <!-- Sweetgreen Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button 
              (click)="toggleChefSpecial()" 
              [class]="onlyChefSpecial() ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-white dark:bg-[#142219] text-[#19231a]/80 dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527]'"
              class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors">
              ★ Chef's Specials
            </button>
            <button 
              (click)="toggleTopRecipe()" 
              [class]="onlyTopRecipe() ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-white dark:bg-[#142219] text-[#19231a]/80 dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527]'"
              class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors">
              🏆 Top Recipes
            </button>
            <button 
              (click)="toggleInStock()" 
              [class]="onlyInStock() ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-white dark:bg-[#142219] text-[#19231a]/80 dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527]'"
              class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors">
              ✓ In Stock Only
            </button>
          </div>
        </div>

        <!-- Category Horizontal Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pt-2 border-b border-[#e8e4dc] dark:border-[#1f3527] pb-4">
          <button 
            (click)="selectCategory(null)" 
            [class]="selectedCategoryId() === null ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold' : 'bg-white dark:bg-[#142219] text-[#19231a]/70 dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527] hover:text-[#133820]'"
            class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm">
            All Bowls & Plates
          </button>
          <button 
            *ngFor="let cat of menuService.categories()" 
            (click)="selectCategory(cat.id)"
            [class]="selectedCategoryId() === cat.id ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold' : 'bg-white dark:bg-[#142219] text-[#19231a]/70 dark:text-slate-300 border border-[#e8e4dc] dark:border-[#1f3527] hover:text-[#133820]'"
            class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-sm">
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="menuService.loading()" class="py-20 text-center text-[#19231a]/70 dark:text-slate-400">
        <div class="inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-3 text-xs font-medium">Harvesting delicious seasonal recipes...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!menuService.loading() && filteredItems().length === 0" class="py-20 text-center bg-white dark:bg-[#142219] rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527]">
        <span class="text-4xl">🥗</span>
        <h3 class="font-serif text-lg text-[#133820] dark:text-slate-200 mt-2 font-bold">No dishes match your selection</h3>
        <p class="text-xs text-slate-500 mt-1">Try resetting filters or searching for another ingredient keyword.</p>
      </div>

      <!-- Menu Items Grid -->
      <div *ngIf="!menuService.loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          *ngFor="let item of filteredItems()" 
          class="bg-white dark:bg-[#142219] rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] hover:border-emerald-600/40 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
          
          <div>
            <!-- Photo & Badges -->
            <div class="relative h-60 overflow-hidden bg-[#f4ede0] dark:bg-[#0c1510]">
              <img 
                [src]="item.photo_url || 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80'" 
                [alt]="item.name" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                [class.grayscale]="!item.in_stock">

              <div class="absolute top-3 left-3 flex flex-wrap gap-2">
                <span *ngIf="item.is_chef_special" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] shadow-sm">
                  Chef's Special
                </span>
                <span *ngIf="item.is_top_recipe" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#eaf4eb] text-emerald-900 border border-emerald-300/60 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-sm">
                  Top Recipe
                </span>
              </div>

              <!-- Out of Stock Indicator -->
              <div *ngIf="!item.in_stock" class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                <span class="px-4 py-1.5 bg-red-900/90 text-white text-xs font-bold rounded-full uppercase tracking-wider border border-red-500/40">
                  Sold Out for Today
                </span>
              </div>
            </div>

            <!-- Item Body -->
            <div class="p-6">
              <div class="flex items-start justify-between gap-4">
                <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {{ item.name }}
                </h3>
                <span class="font-serif text-xl font-bold text-[#133820] dark:text-[#4ade80] whitespace-nowrap">
                  {{ contentService.contents()['currency_symbol'] || '$' }}{{ item.price | number:'1.2-2' }}
                </span>
              </div>

              <p class="text-xs text-[#19231a]/70 dark:text-slate-300 mt-2.5 leading-relaxed">
                {{ item.description }}
              </p>

              <!-- Dietary Tags -->
              <div *ngIf="item.tags" class="mt-4 flex flex-wrap gap-1.5">
                <span 
                  *ngFor="let tag of item.tags.split(',')" 
                  class="px-2.5 py-1 rounded-full bg-[#eaf4eb] dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                  {{ tag.trim() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="p-6 pt-0">
            <a 
              routerLink="/reserve" 
              class="w-full block py-3 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-[#133820] text-white hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] shadow-sm hover:shadow transition-all">
              Reserve Table to Savor
            </a>
          </div>

        </div>
      </div>

    </div>
  `
})
export class MenuComponent implements OnInit {
  menuService = inject(MenuService);
  contentService = inject(ContentService);

  searchQuery = '';
  selectedCategoryId = signal<number | null>(null);
  onlyChefSpecial = signal(false);
  onlyTopRecipe = signal(false);
  onlyInStock = signal(false);

  ngOnInit(): void {
    this.contentService.loadContent().subscribe();
    this.menuService.loadCategories().subscribe();
    this.menuService.loadItems().subscribe();
  }

  selectCategory(catId: number | null): void {
    this.selectedCategoryId.set(catId);
  }

  toggleChefSpecial(): void {
    this.onlyChefSpecial.update((v) => !v);
  }

  toggleTopRecipe(): void {
    this.onlyTopRecipe.update((v) => !v);
  }

  toggleInStock(): void {
    this.onlyInStock.update((v) => !v);
  }

  onFilterChange(): void {
    // reactive
  }

  filteredItems() {
    let list = this.menuService.items();

    if (this.selectedCategoryId() !== null) {
      list = list.filter((i) => i.category_id === this.selectedCategoryId());
    }
    if (this.onlyChefSpecial()) {
      list = list.filter((i) => i.is_chef_special);
    }
    if (this.onlyTopRecipe()) {
      list = list.filter((i) => i.is_top_recipe);
    }
    if (this.onlyInStock()) {
      list = list.filter((i) => i.in_stock);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((i) => 
        i.name.toLowerCase().includes(q) || 
        i.description?.toLowerCase().includes(q) ||
        i.tags?.toLowerCase().includes(q)
      );
    }

    return list;
  }
}
