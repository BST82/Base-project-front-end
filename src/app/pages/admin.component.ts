import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService } from '../core/services/content.service';
import { MenuService } from '../core/services/menu.service';
import { ReservationService } from '../core/services/reservation.service';
import { ReviewService } from '../core/services/review.service';
import { NavigationService } from '../core/services/navigation.service';
import { BranchService } from '../core/services/branch.service';
import { BannerSlideService } from '../core/services/banner-slide.service';
import { StoryService } from '../core/services/story.service';
import { ToastService } from '../core/services/toast.service';
import { DialogService } from '../core/services/dialog.service';
import { DynamicPageService } from '../core/services/dynamic-page.service';
import { MenuItem, Category, Reservation, Review, NavItem, Branch, BannerSlide, Story, DynamicPage, PageHeroSlide, ContentBlockItem } from '../core/models';

type AdminTab = 'nav' | 'dynamic-pages' | 'hero' | 'menu' | 'locations' | 'reservations' | 'stories' | 'footer' | 'reviews';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- ADMIN TOP HEADER: SWEETGREEN BACK-OF-HOUSE -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#e8e4dc] dark:border-[#1f3527] gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Back of House CMS Portal</span>
          </div>
          <h1 class="font-serif text-3xl font-black text-[#133820] dark:text-[#f3f4f6] mt-1">Executive Restaurant Administration</h1>
        </div>

        <!-- LIVE STATUS BADGE -->
        <div class="flex items-center gap-3">
          <div class="px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-2 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>CMS Database Connected</span>
          </div>
        </div>
      </div>

      <!-- SWEETGREEN TAB PILLS NAVIGATION -->
      <div class="flex items-center gap-1.5 overflow-x-auto py-4 scrollbar-none border-b border-[#e8e4dc] dark:border-[#1f3527]">
        <button 
          (click)="activeTab.set('nav')"
          [class]="activeTab() === 'nav' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>🧭</span>
          <span>Header & Navigation</span>
        </button>
        <button 
          (click)="activeTab.set('dynamic-pages')"
          [class]="activeTab() === 'dynamic-pages' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>📄</span>
          <span>Dynamic Pages CMS</span>
          <span *ngIf="dynamicPageService.pages().length > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white dark:text-[#0c1510] font-black">
            {{ dynamicPageService.pages().length }}
          </span>
        </button>
        <button 
          (click)="activeTab.set('hero')"
          [class]="activeTab() === 'hero' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>🖼️</span>
          <span>Hero & Slider CMS</span>
        </button>
        <button 
          (click)="activeTab.set('menu')"
          [class]="activeTab() === 'menu' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>📋</span>
          <span>Food Menu CMS</span>
        </button>
        <button 
          (click)="activeTab.set('locations')"
          [class]="activeTab() === 'locations' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>📍</span>
          <span>Store Locator</span>
        </button>
        <button 
          (click)="activeTab.set('reservations')"
          [class]="activeTab() === 'reservations' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>🪑</span>
          <span>Reservations Engine</span>
        </button>
        <button 
          (click)="activeTab.set('stories')"
          [class]="activeTab() === 'stories' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>📖</span>
          <span>"Our Stories" CMS</span>
        </button>
        <button 
          (click)="activeTab.set('footer')"
          [class]="activeTab() === 'footer' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>🦶</span>
          <span>Footer CMS</span>
        </button>
        <button 
          (click)="activeTab.set('reviews')"
          [class]="activeTab() === 'reviews' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#111d15] text-[#19231a] dark:text-slate-300 hover:bg-[#eae4d9]'"
          class="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5">
          <span>💬</span>
          <span>Reviews Moderation</span>
        </button>
      </div>

      <!-- =================================================================== -->
      <!-- TAB 1: HEADER & NAVIGATION CRUD + THEME COLORS -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'nav'" class="mt-8 space-y-8 animate-fade-in">
        
        <!-- Theme Colors Customizer -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4ede0] dark:border-[#1f3527] mb-6">
            <div>
              <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Brand Theme Colors & Styling</h2>
              <p class="text-xs text-slate-500 mt-0.5">Customize global primary green and warm accents.</p>
            </div>
            <button 
              (click)="saveThemeColors()"
              class="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all">
              Save Colors
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Primary Theme Color</label>
              <div class="flex items-center gap-3">
                <input type="color" [(ngModel)]="cmsDraft['theme_primary_color']" class="w-12 h-10 rounded-xl cursor-pointer border border-[#e2ded6]">
                <input type="text" [(ngModel)]="cmsDraft['theme_primary_color']" class="flex-1 px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono">
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Accent Accent Color</label>
              <div class="flex items-center gap-3">
                <input type="color" [(ngModel)]="cmsDraft['theme_accent_color']" class="w-12 h-10 rounded-xl cursor-pointer border border-[#e2ded6]">
                <input type="text" [(ngModel)]="cmsDraft['theme_accent_color']" class="flex-1 px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono">
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Color Palette Presets</label>
              <div class="flex flex-wrap gap-2 pt-1">
                <button (click)="applyPalette('#133820', '#d97706')" class="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#133820] text-amber-200">
                  Sweetgreen Classic
                </button>
                <button (click)="applyPalette('#1b4332', '#52b788')" class="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#1b4332] text-emerald-200">
                  Emerald Napa
                </button>
                <button (click)="applyPalette('#1f1f1f', '#eab308')" class="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#1f1f1f] text-yellow-300">
                  Modern Obsidian
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add / Edit Nav Item Form -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-1">
            {{ editingNavId ? 'Edit Navigation Link' : 'Add New Navigation Link' }}
          </h2>
          <p class="text-xs text-slate-500 mb-6">Manage live header routes, links, order, and external URLs.</p>

          <form [formGroup]="navForm" (ngSubmit)="onSaveNavItem()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Link Label</label>
              <input type="text" formControlName="label" placeholder="e.g. Catering & Events" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Target Route or URL</label>
              <input type="text" formControlName="route" placeholder="e.g. /catering or https://..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Display Order</label>
              <input type="number" formControlName="display_order" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="flex items-center gap-6 pt-5">
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_active" class="w-4 h-4 text-emerald-600 rounded">
                Active
              </label>
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_external" class="w-4 h-4 text-emerald-600 rounded">
                External Link
              </label>
            </div>

            <!-- Auto-scaffold Dynamic Page Checkbox Card -->
            <div *ngIf="!editingNavId" class="sm:col-span-2 md:col-span-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 space-y-3">
              <label class="flex items-center gap-2.5 text-xs font-bold text-[#133820] dark:text-emerald-300 cursor-pointer">
                <input type="checkbox" formControlName="create_page" class="w-4 h-4 text-emerald-600 rounded">
                <span>✨ Auto-Scaffold Layout-Inherited Dynamic Page (Hero Slider + Modular Content Blocks)</span>
              </label>
              
              <div *ngIf="navForm.get('create_page')?.value" class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Page Headline</label>
                  <input type="text" formControlName="page_title" placeholder="Defaults to link label" class="w-full px-3 py-2 bg-white dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Subtitle / Mission</label>
                  <input type="text" formControlName="page_subtitle" placeholder="e.g. Crafted moments of gastronomic grace..." class="w-full px-3 py-2 bg-white dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                </div>
              </div>
            </div>

            <div class="sm:col-span-2 md:col-span-4 flex items-center justify-end gap-3 pt-2">
              <button 
                *ngIf="editingNavId" 
                type="button" 
                (click)="cancelNavEdit()" 
                class="px-5 py-2.5 rounded-full text-xs font-bold border border-[#e2ded6]">
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="navForm.invalid"
                class="px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all disabled:opacity-40">
                {{ editingNavId ? 'Update Nav Item' : 'Add Nav Item & Scaffold Page' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Live Nav Items Table -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-4">Active Header Links</h2>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#f4ede0] dark:border-[#1f3527] text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-2">Order</th>
                  <th class="py-3 px-2">Label</th>
                  <th class="py-3 px-2">Route / URL</th>
                  <th class="py-3 px-2">Type</th>
                  <th class="py-3 px-2">Status</th>
                  <th class="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f4ede0] dark:divide-[#1f3527]">
                <tr *ngFor="let item of navService.navItems()">
                  <td class="py-3.5 px-2 font-mono font-bold">{{ item.display_order }}</td>
                  <td class="py-3.5 px-2 font-bold text-[#133820] dark:text-slate-100">{{ item.label }}</td>
                  <td class="py-3.5 px-2 font-mono text-slate-500">{{ item.route }}</td>
                  <td class="py-3.5 px-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold" [class]="item.is_external ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'">
                      {{ item.is_external ? 'External' : 'Internal' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {{ item.is_active ? 'Active' : 'Hidden' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2 text-right space-x-2">
                    <button 
                      *ngIf="!item.is_external && item.route !== '/'" 
                      (click)="openDynamicPageEditorBySlug(item.page_slug || item.route)" 
                      class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100 transition-colors">
                      📄 Edit Page
                    </button>
                    <button (click)="startNavEdit(item)" class="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Edit</button>
                    <button (click)="deleteNavItem(item.id, item.label)" class="text-red-600 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 2: DYNAMIC PAGES CMS (HERO SLIDER + MODULAR BLOCKS) -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'dynamic-pages'" class="mt-8 space-y-8 animate-fade-in">
        
        <!-- TOP ACTIONS & BANNER -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span>📄 Layout-Inherited Pages Engine</span>
            </div>
            <h2 class="font-serif text-3xl font-bold text-[#133820] dark:text-[#f3f4f6]">
              Dynamic Pages & Template Manager
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Every navigation tab can be paired with an editable layout inheriting master navigation, hero slider, and modular content blocks.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button 
              *ngIf="selectedPage()"
              (click)="selectedPage.set(null)"
              class="px-5 py-2.5 rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#22382b] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              ← Back to All Pages
            </button>
            <button 
              (click)="createNewPageDraft()"
              class="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all">
              + Scaffold New Page
            </button>
          </div>
        </div>

        <!-- VIEW A: ALL DYNAMIC PAGES DIRECTORY (Cards & Table) -->
        <div *ngIf="!selectedPage()" class="space-y-6">
          <div *ngIf="dynamicPageService.pages().length === 0" class="bg-white dark:bg-[#142219] p-12 text-center rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527]">
            <span class="text-4xl">📄</span>
            <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6] mt-2">No Dynamic Pages Created Yet</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Add a new menu tab in "Header & Navigation" with "Auto-scaffold Dynamic Page" enabled or click "+ Scaffold New Page" above.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              *ngFor="let p of dynamicPageService.pages()" 
              class="bg-white dark:bg-[#142219] rounded-3xl p-6 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                    /{{ p.slug }}
                  </span>
                  <span 
                    [class]="p.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ p.is_published ? 'Live' : 'Draft' }}
                  </span>
                </div>

                <div>
                  <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6]">
                    {{ p.title }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {{ p.subtitle || p.meta_description || 'No subtitle provided.' }}
                  </p>
                </div>

                <!-- Stats Badges -->
                <div class="flex items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>🖼️ {{ p.hero_slides.length }} Slides</span>
                  <span>•</span>
                  <span>🧱 {{ p.content_blocks.length }} Blocks</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-4 border-t border-[#f4ede0] dark:border-[#1f3527] flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button 
                    (click)="openPageEditor(p)"
                    class="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#133820] dark:bg-[#22c55e] dark:text-[#0c1510] hover:opacity-90 shadow-sm transition-all">
                    ✏️ Edit Layout
                  </button>
                  <a 
                    [routerLink]="['/', p.slug]" 
                    target="_blank"
                    class="px-3 py-2 rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#1f3527] hover:bg-[#faf8f5] dark:hover:bg-[#0c1510] transition-colors"
                    title="Open live preview in new tab">
                    👁️ Preview ↗
                  </a>
                </div>

                <button 
                  (click)="deletePage(p.id, p.title)"
                  class="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
                  🗑️
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- VIEW B: VISUAL PAGE EDITOR (When a page is selected) -->
        <div *ngIf="selectedPage()" class="space-y-8">
          
          <!-- Editor Sub-Header & Live Tabs -->
          <div class="bg-white dark:bg-[#142219] p-6 rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span class="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-400">Editing Page Layout</span>
              <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">
                {{ selectedPage()?.title }}
              </h2>
              <span class="font-mono text-xs text-slate-500">Route: /{{ selectedPage()?.slug }}</span>
            </div>

            <div class="flex items-center gap-3">
              <a 
                [routerLink]="['/', selectedPage()?.slug]" 
                target="_blank"
                class="px-4 py-2 rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#1f3527] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                👁️ Live Preview ↗
              </a>
              <button 
                (click)="saveSelectedPage()"
                class="px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-lg transition-all transform hover:-translate-y-0.5">
                💾 Save Layout Changes
              </button>
            </div>
          </div>

          <!-- Section 1: Page Details Form -->
          <div class="bg-white dark:bg-[#142219] p-6 sm:p-8 rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-4">
            <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6]">1. Page Header & Identity</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Page Title</label>
                <input type="text" [(ngModel)]="selectedPage()!.title" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs font-semibold">
              </div>
              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Route Slug</label>
                <input type="text" [(ngModel)]="selectedPage()!.slug" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs font-mono">
              </div>
              <div class="flex items-center pt-6">
                <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="selectedPage()!.is_published" class="w-4 h-4 text-emerald-600 rounded">
                  <span>Page Live & Published</span>
                </label>
              </div>
              <div class="sm:col-span-2 md:col-span-3">
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Subtitle / Mission Statement</label>
                <input type="text" [(ngModel)]="selectedPage()!.subtitle" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
              </div>
            </div>
          </div>

          <!-- Section 2: Hero Banner Slider (Multi-Image Upload + Captions) -->
          <div class="bg-white dark:bg-[#142219] p-6 sm:p-8 rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-6">
            <div class="flex items-center justify-between pb-3 border-b border-[#f4ede0] dark:border-[#1f3527]">
              <div>
                <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6]">2. Hero Banner Slider</h3>
                <p class="text-xs text-slate-500">Add multi-image slides, headlines, vintage badges, and primary/secondary buttons.</p>
              </div>
              <button 
                (click)="addHeroSlideToSelectedPage()"
                class="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 transition-all">
                + Add Slide
              </button>
            </div>

            <!-- Slides List -->
            <div class="space-y-6">
              <div 
                *ngFor="let slide of selectedPage()!.hero_slides; let sIdx = index"
                class="p-5 sm:p-6 rounded-2xl bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e8e4dc] dark:border-[#1f3527] space-y-4">
                
                <div class="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <span class="text-xs font-bold text-emerald-800 dark:text-emerald-400">Slide #{{ sIdx + 1 }}</span>
                  <button 
                    *ngIf="selectedPage()!.hero_slides.length > 1"
                    (click)="removeHeroSlide(sIdx)"
                    class="text-xs font-bold text-red-600 hover:underline">
                    Remove Slide ✕
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <!-- Photo Preview & Upload -->
                  <div class="sm:col-span-2 md:col-span-1">
                    <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Slide Image</label>
                    <div class="aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 mb-2 border">
                      <img [src]="slide.image_url" alt="Slide" class="w-full h-full object-cover">
                    </div>
                    <input 
                      type="file" 
                      (change)="uploadSlideImage($event, sIdx)" 
                      accept="image/*"
                      class="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-emerald-100 file:text-emerald-800">
                    <input 
                      type="url" 
                      [(ngModel)]="slide.image_url" 
                      placeholder="Or enter image URL" 
                      class="w-full mt-2 px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                  </div>

                  <!-- Captions & Headings -->
                  <div class="sm:col-span-2 md:col-span-2 space-y-3">
                    <div>
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Headline</label>
                      <input type="text" [(ngModel)]="slide.title" placeholder="Main Hero Headline" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-bold">
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Badge Text</label>
                        <input type="text" [(ngModel)]="slide.badge_text" placeholder="e.g. CURATED TASTINGS" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                      </div>
                      <div>
                        <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Ribbon / Caption</label>
                        <input type="text" [(ngModel)]="slide.caption" placeholder="e.g. ARTISAN GASTRONOMY" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                      </div>
                    </div>

                    <div>
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Subtitle / Paragraph</label>
                      <textarea [(ngModel)]="slide.subtitle" rows="2" placeholder="Slide lead text..." class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs"></textarea>
                    </div>

                    <!-- CTA Buttons -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Primary Button Text & Link</label>
                        <div class="flex gap-2">
                          <input type="text" [(ngModel)]="slide.button_primary_text" placeholder="Reserve Table" class="w-1/2 px-3 py-1.5 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                          <input type="text" [(ngModel)]="slide.button_primary_link" placeholder="/reserve" class="w-1/2 px-3 py-1.5 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono">
                        </div>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Secondary Button Text & Link</label>
                        <div class="flex gap-2">
                          <input type="text" [(ngModel)]="slide.button_secondary_text" placeholder="Explore Menu" class="w-1/2 px-3 py-1.5 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                          <input type="text" [(ngModel)]="slide.button_secondary_link" placeholder="/menu" class="w-1/2 px-3 py-1.5 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono">
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          <!-- Section 3: Modular Content Blocks Manager -->
          <div class="bg-white dark:bg-[#142219] p-6 sm:p-8 rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f4ede0] dark:border-[#1f3527] gap-3">
              <div>
                <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6]">3. Modular Content Blocks</h3>
                <p class="text-xs text-slate-500">Configure editorial stories, split image-text sections, feature cards, and conversion banners.</p>
              </div>

              <!-- Add Block Dropdown Pills -->
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-bold text-slate-500">Add Block:</span>
                <button (click)="addContentBlock('rich_text')" class="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100 transition-colors">
                  + Rich Text
                </button>
                <button (click)="addContentBlock('split_content')" class="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 hover:bg-amber-100 transition-colors">
                  + Split Image
                </button>
                <button (click)="addContentBlock('feature_grid')" class="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 hover:bg-blue-100 transition-colors">
                  + Feature Grid
                </button>
                <button (click)="addContentBlock('cta_banner')" class="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 hover:bg-purple-100 transition-colors">
                  + CTA Banner
                </button>
              </div>
            </div>

            <!-- Blocks List -->
            <div class="space-y-6">
              <div 
                *ngFor="let block of selectedPage()!.content_blocks; let bIdx = index"
                class="p-5 sm:p-6 rounded-2xl bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e8e4dc] dark:border-[#1f3527] space-y-4">
                
                <div class="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Block #{{ bIdx + 1 }}:</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {{ block.block_type.replace('_', ' ') }}
                    </span>
                  </div>
                  <button (click)="removeContentBlock(bIdx)" class="text-xs font-bold text-red-600 hover:underline">
                    Remove Block ✕
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Badge / Tag</label>
                    <input type="text" [(ngModel)]="block.badge" placeholder="e.g. PHILOSOPHY & VISION" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Heading</label>
                    <input type="text" [(ngModel)]="block.heading" placeholder="Section Headline" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-bold">
                  </div>
                  <div class="sm:col-span-2 md:col-span-3">
                    <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Subheading</label>
                    <input type="text" [(ngModel)]="block.subheading" placeholder="Lead explanation..." class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                  </div>

                  <!-- Body Text for rich_text & split_content -->
                  <div *ngIf="block.block_type === 'rich_text' || block.block_type === 'split_content'" class="sm:col-span-2 md:col-span-3">
                    <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Body Text (Supports HTML paragraphs & formatting)</label>
                    <textarea [(ngModel)]="block.body" rows="4" placeholder="<p>Story and content paragraphs go here...</p>" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono"></textarea>
                  </div>

                  <!-- Image URL & Upload for split_content -->
                  <div *ngIf="block.block_type === 'split_content'" class="sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Section Image URL</label>
                      <input type="url" [(ngModel)]="block.image_url" placeholder="https://..." class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                    </div>
                    <div>
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Or Upload Image</label>
                      <input 
                        type="file" 
                        (change)="uploadBlockImage($event, bIdx)" 
                        accept="image/*"
                        class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-emerald-100 file:text-emerald-800">
                    </div>
                  </div>

                  <!-- Button Text & Link for split_content & cta_banner -->
                  <div *ngIf="block.block_type === 'split_content' || block.block_type === 'cta_banner'" class="sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Button Text</label>
                      <input type="text" [(ngModel)]="block.button_text" placeholder="e.g. Reserve a Table" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                    </div>
                    <div>
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Button Link / Route</label>
                      <input type="text" [(ngModel)]="block.button_link" placeholder="e.g. /reserve" class="w-full px-3 py-2 bg-white dark:bg-[#142219] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono">
                    </div>
                  </div>

                  <!-- Items editor for feature_grid -->
                  <div *ngIf="block.block_type === 'feature_grid'" class="sm:col-span-2 md:col-span-3 space-y-3">
                    <div class="flex items-center justify-between">
                      <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400">Feature Items ({{ block.items?.length || 0 }})</label>
                      <button (click)="addFeatureItem(block)" class="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline">+ Add Feature Item</button>
                    </div>

                    <div *ngFor="let item of block.items; let itIdx = index" class="p-3 bg-white dark:bg-[#142219] rounded-xl border border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center gap-3">
                      <input type="text" [(ngModel)]="item.icon" placeholder="Icon" class="w-16 px-2 py-1.5 border rounded-lg text-center text-sm">
                      <input type="text" [(ngModel)]="item.title" placeholder="Feature Title" class="w-full sm:w-1/3 px-3 py-1.5 border rounded-lg text-xs font-bold">
                      <input type="text" [(ngModel)]="item.description" placeholder="Short description..." class="w-full sm:flex-1 px-3 py-1.5 border rounded-lg text-xs">
                      <button (click)="removeFeatureItem(block, itIdx)" class="text-xs text-red-500 hover:text-red-700">✕</button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          <!-- Bottom Save Floating CTA -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <button 
              (click)="selectedPage.set(null)"
              class="px-6 py-3 rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#22382b]">
              Cancel & Exit Editor
            </button>
            <button 
              (click)="saveSelectedPage()"
              class="px-10 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-xl transition-all transform hover:-translate-y-0.5">
              💾 Save & Publish Page Layout
            </button>
          </div>

        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 2: HERO & PAGE CONTENT CMS (LOGO UPLOAD & SLIDER) -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'hero'" class="mt-8 space-y-8 animate-fade-in">
        
        <!-- Brand Logo & Header Upload -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4ede0] dark:border-[#1f3527] mb-6">
            <div>
              <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Brand Logo & Identity</h2>
              <p class="text-xs text-slate-500 mt-0.5">Upload a dynamic custom brand logo or set monogram text.</p>
            </div>
            <button 
              (click)="saveHeroCopy()" 
              class="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all">
              Save Content
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <!-- Logo Preview -->
            <div class="flex flex-col items-center justify-center p-6 bg-[#faf8f5] dark:bg-[#0c1510] rounded-2xl border border-[#e8e4dc] dark:border-[#1f3527] text-center">
              <div *ngIf="cmsDraft['brand_logo_url']" class="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-600 shadow-md mb-2">
                <img [src]="cmsDraft['brand_logo_url']" alt="Logo Preview" class="w-full h-full object-cover">
              </div>
              <div *ngIf="!cmsDraft['brand_logo_url']" class="w-20 h-20 rounded-full bg-[#133820] text-white flex items-center justify-center text-3xl font-serif font-black shadow-md mb-2">
                {{ (cmsDraft['logo_text'] || 'A')[0] }}
              </div>
              <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Live Header Icon</span>
            </div>

            <!-- Upload Controls -->
            <div class="md:col-span-2 space-y-4">
              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Brand Name Text</label>
                <input type="text" [(ngModel)]="cmsDraft['logo_text']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
              </div>

              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Upload Brand Logo File</label>
                <input 
                  type="file" 
                  (change)="onUploadLogo($event)" 
                  accept="image/*"
                  class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200">
              </div>

              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Or Direct Logo Image URL</label>
                <input type="url" [(ngModel)]="cmsDraft['brand_logo_url']" placeholder="https://..." class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
              </div>
            </div>
          </div>
        </div>

        <!-- Section-by-Section Text Editing -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-1">Section-by-Section Copy & Headings</h2>
          <p class="text-xs text-slate-500 mb-6">Edit top announcement banner, hero title, hours, and contact details.</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Top Announcement Banner</label>
              <input type="text" [(ngModel)]="cmsDraft['announcement_banner']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Hero Main Title (Overhead Banner)</label>
              <input type="text" [(ngModel)]="cmsDraft['hero_title']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Hero Subtitle Description</label>
              <textarea [(ngModel)]="cmsDraft['hero_subtitle']" rows="2" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs"></textarea>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Daily Operating Hours</label>
              <input type="text" [(ngModel)]="cmsDraft['operating_hours']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Contact Phone</label>
              <input type="text" [(ngModel)]="cmsDraft['contact_phone']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Contact Email</label>
              <input type="text" [(ngModel)]="cmsDraft['contact_email']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Physical Flagship Address</label>
              <input type="text" [(ngModel)]="cmsDraft['address']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>
          </div>
        </div>

        <!-- Banner Slider CMS -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-1">
            {{ editingSlideId ? 'Edit Banner Slide' : 'Add New Hero Banner Slide' }}
          </h2>
          <p class="text-xs text-slate-500 mb-6">Manage multi-slide carousel items with transitions, custom images, badges, and CTA buttons.</p>

          <form [formGroup]="slideForm" (ngSubmit)="onSaveSlide()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Slide Title</label>
              <input type="text" formControlName="title" placeholder="e.g. GOODNESS EATS" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Badge Text</label>
              <input type="text" formControlName="badge_text" placeholder="e.g. Scratch Kitchen • Direct Farm Partnerships" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Display Order</label>
              <input type="number" formControlName="display_order" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="sm:col-span-2 md:col-span-3">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Slide Subtitle / Description</label>
              <textarea formControlName="subtitle" rows="2" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs"></textarea>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Slide Background Image URL</label>
              <input type="url" formControlName="image_url" placeholder="/hero_table_banner.jpg or https://..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Or Upload Slide Image File</label>
              <input 
                type="file" 
                (change)="onUploadSlideImage($event)" 
                accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">CTA Button Text</label>
              <input type="text" formControlName="cta_text" placeholder="Make a Reservation" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">CTA Button Route / Link</label>
              <input type="text" formControlName="cta_link" placeholder="/reserve" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="flex items-center gap-2 pt-6">
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_active" class="w-4 h-4 text-emerald-600 rounded">
                Slide Active
              </label>
            </div>

            <div class="sm:col-span-2 md:col-span-3 flex justify-end gap-3 pt-2">
              <button 
                *ngIf="editingSlideId" 
                type="button" 
                (click)="cancelSlideEdit()" 
                class="px-5 py-2.5 rounded-full text-xs font-bold border border-[#e2ded6]">
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="slideForm.invalid"
                class="px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all disabled:opacity-40">
                {{ editingSlideId ? 'Update Slide' : 'Add Banner Slide' }}
              </button>
            </div>
          </form>

          <!-- Slides Table -->
          <div class="mt-8 pt-6 border-t border-[#f4ede0] dark:border-[#1f3527]">
            <h3 class="font-serif text-lg font-bold text-[#133820] dark:text-[#f3f4f6] mb-4">Current Banner Slides ({{ bannerSlideService.slides().length }})</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                *ngFor="let s of bannerSlideService.slides()"
                class="rounded-2xl border border-[#e8e4dc] dark:border-[#1f3527] overflow-hidden bg-[#faf8f5] dark:bg-[#0c1510] flex flex-col justify-between">
                <div class="relative h-32 bg-slate-800">
                  <img [src]="s.image_url" [alt]="s.title" class="w-full h-full object-cover">
                  <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white">
                    #{{ s.display_order }}
                  </span>
                </div>
                <div class="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 class="font-bold text-sm text-[#133820] dark:text-slate-100">{{ s.title }}</h4>
                    <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">{{ s.subtitle }}</p>
                  </div>
                  <div class="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                    <button (click)="startSlideEdit(s)" class="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Edit</button>
                    <button (click)="deleteSlide(s.id, s.title)" class="text-red-600 font-bold hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 3: FOOD MENU CMS (CATEGORIZED DISHES + IMAGE UPLOAD) -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'menu'" class="mt-8 space-y-8 animate-fade-in">
        
        <!-- Add / Edit Dish Form -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-1">
            {{ editingItemId ? 'Edit Artisan Dish' : 'Create New Harvest Recipe' }}
          </h2>
          <p class="text-xs text-slate-500 mb-6">Manage categorized recipes with file uploads and persistence.</p>

          <form [formGroup]="itemForm" (ngSubmit)="onAddItem()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Dish Name</label>
              <input type="text" formControlName="name" placeholder="e.g. Harvest Bowl" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select formControlName="category_id" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
                <option *ngFor="let cat of menuService.categories()" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Price ($)</label>
              <input type="number" step="0.5" formControlName="price" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="sm:col-span-2 md:col-span-3">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Recipe Description</label>
              <textarea formControlName="description" rows="2" placeholder="List organic ingredients and flavor notes..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs"></textarea>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Dish Image URL</label>
              <input type="url" formControlName="photo_url" placeholder="https://..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Or Upload Dish Photo</label>
              <input 
                type="file" 
                (change)="onUploadDishImage($event)" 
                accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Dietary Tags</label>
              <input type="text" formControlName="tags" placeholder="Organic, Gluten-Free, Vegan" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="sm:col-span-2 md:col-span-3 flex items-center gap-6 pt-2">
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_chef_special" class="w-4 h-4 text-emerald-600 rounded">
                Chef's Special
              </label>
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_top_recipe" class="w-4 h-4 text-emerald-600 rounded">
                Top Recipe
              </label>
            </div>

            <div class="sm:col-span-2 md:col-span-3 flex justify-end gap-3">
              <button 
                *ngIf="editingItemId" 
                type="button" 
                (click)="cancelDishEdit()" 
                class="px-6 py-3 rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#1f3527]">
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="itemForm.invalid"
                class="px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all disabled:opacity-40">
                {{ editingItemId ? 'Update Dish' : 'Add Dish to Live Menu' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Live Dishes Table -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-4">Active Menu Items ({{ menuService.items().length }})</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#f4ede0] dark:border-[#1f3527] text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-2">Dish</th>
                  <th class="py-3 px-2">Category</th>
                  <th class="py-3 px-2">Price</th>
                  <th class="py-3 px-2">Special</th>
                  <th class="py-3 px-2">Stock Status</th>
                  <th class="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f4ede0] dark:divide-[#1f3527]">
                <tr *ngFor="let item of menuService.items()">
                  <td class="py-3.5 px-2 font-bold text-[#133820] dark:text-slate-100 flex items-center gap-3">
                    <img [src]="item.photo_url || '/hero_table_banner.jpg'" class="w-9 h-9 rounded-xl object-cover">
                    <span>{{ item.name }}</span>
                  </td>
                  <td class="py-3.5 px-2 text-slate-500">{{ item.category?.name || 'Category ' + item.category_id }}</td>
                  <td class="py-3.5 px-2 font-bold text-emerald-800 dark:text-emerald-400">\${{ item.price | number:'1.2-2' }}</td>
                  <td class="py-3.5 px-2">
                    <span *ngIf="item.is_chef_special" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Chef Special</span>
                  </td>
                  <td class="py-3.5 px-2">
                    <button 
                      (click)="toggleStock(item.id)" 
                      [class]="item.in_stock ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300'"
                      class="px-3 py-1 rounded-full text-[10px] font-bold border transition-colors">
                      {{ item.in_stock ? '✓ In Stock' : '✕ Out of Stock' }}
                    </button>
                  </td>
                  <td class="py-3.5 px-2 text-right space-x-3">
                    <button (click)="startDishEdit(item)" class="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Edit</button>
                    <button (click)="deleteDish(item.id, item.name)" class="text-red-600 dark:text-red-400 hover:underline font-bold">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 4: STORE LOCATOR (BRANCHES & COORDINATES CRUD) -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'locations'" class="mt-8 space-y-8 animate-fade-in">
        
        <!-- Add / Edit Branch Form -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-1">
            {{ editingBranchId ? 'Edit Restaurant Branch' : 'Add New Branch Location' }}
          </h2>
          <p class="text-xs text-slate-500 mb-6">Manage multi-city store addresses, map coordinates (latitude/longitude), and operating hours.</p>

          <form [formGroup]="branchForm" (ngSubmit)="onSaveBranch()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Branch Name</label>
              <input type="text" formControlName="name" placeholder="e.g. Aura Downtown Flagship" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">City</label>
              <input type="text" formControlName="city" placeholder="e.g. San Francisco" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">State & Zip</label>
              <div class="flex gap-2">
                <input type="text" formControlName="state" placeholder="CA" class="w-1/3 px-3 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
                <input type="text" formControlName="zip_code" placeholder="94102" class="w-2/3 px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
              </div>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
              <input type="text" formControlName="address" placeholder="100 Market Street" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Contact Phone</label>
              <input type="text" formControlName="phone" placeholder="+1 (415) 555-0199" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Latitude Coordinate</label>
              <input type="number" step="0.000001" formControlName="latitude" placeholder="37.7749" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs font-mono">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Longitude Coordinate</label>
              <input type="number" step="0.000001" formControlName="longitude" placeholder="-122.4194" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs font-mono">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Operating Hours</label>
              <input type="text" formControlName="operating_hours" placeholder="Mon-Sun: 11am-10pm" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="sm:col-span-2 md:col-span-3 flex items-center justify-between pt-2">
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_active" class="w-4 h-4 text-emerald-600 rounded">
                Branch Active & Open for Reservations
              </label>

              <div class="flex gap-3">
                <button 
                  *ngIf="editingBranchId" 
                  type="button" 
                  (click)="cancelBranchEdit()" 
                  class="px-5 py-2.5 rounded-full text-xs font-bold border border-[#e2ded6]">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  [disabled]="branchForm.invalid"
                  class="px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all disabled:opacity-40">
                  {{ editingBranchId ? 'Update Branch' : 'Add Branch Location' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Branches Table -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-4">All Active Branches ({{ branchService.branches().length }})</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#f4ede0] dark:border-[#1f3527] text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-2">Branch Name</th>
                  <th class="py-3 px-2">City / State</th>
                  <th class="py-3 px-2">Address</th>
                  <th class="py-3 px-2">Coordinates</th>
                  <th class="py-3 px-2">Hours</th>
                  <th class="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f4ede0] dark:divide-[#1f3527]">
                <tr *ngFor="let b of branchService.branches()">
                  <td class="py-3.5 px-2 font-bold text-[#133820] dark:text-slate-100">{{ b.name }}</td>
                  <td class="py-3.5 px-2 text-slate-600 dark:text-slate-300">{{ b.city }}</td>
                  <td class="py-3.5 px-2 text-slate-500">{{ b.address }}</td>
                  <td class="py-3.5 px-2 font-mono text-[11px] text-emerald-800 dark:text-emerald-400">
                    {{ b.latitude | number:'1.4-4' }}, {{ b.longitude | number:'1.4-4' }}
                  </td>
                  <td class="py-3.5 px-2 text-slate-500">{{ b.opening_hours || b.operating_hours }}</td>
                  <td class="py-3.5 px-2 text-right space-x-3">
                    <button (click)="startBranchEdit(b)" class="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Edit</button>
                    <button (click)="deleteBranch(b.id, b.name)" class="text-red-600 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 5: RESERVATION ENGINE MONITOR & RESCHEDULE -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'reservations'" class="mt-8 space-y-6 animate-fade-in">
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4ede0] dark:border-[#1f3527] mb-6">
            <div>
              <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Floor Reservations Monitor</h2>
              <p class="text-xs text-slate-500 mt-0.5">Real-time table bookings. Update status (Confirm, Cancel, Complete) or Reschedule reservation slots.</p>
            </div>
            <button (click)="loadAllReservations()" class="px-5 py-2 rounded-full border border-[#e8e4dc] dark:border-[#1f3527] text-xs font-bold hover:bg-[#faf8f5]">
              🔄 Refresh
            </button>
          </div>

          <div *ngIf="allReservations().length === 0" class="py-12 text-center text-slate-500 text-xs">
            No active reservations placed yet. Book one from the Reservations page!
          </div>

          <div *ngIf="allReservations().length > 0" class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#f4ede0] dark:border-[#1f3527] text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-2">ID</th>
                  <th class="py-3 px-2">Guest Name</th>
                  <th class="py-3 px-2">Date & Time</th>
                  <th class="py-3 px-2">Table</th>
                  <th class="py-3 px-2">Guests</th>
                  <th class="py-3 px-2">Status</th>
                  <th class="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f4ede0] dark:divide-[#1f3527]">
                <tr *ngFor="let res of allReservations()">
                  <td class="py-3.5 px-2 font-mono font-bold text-slate-500">#{{ res.id }}</td>
                  <td class="py-3.5 px-2 font-bold text-[#133820] dark:text-slate-100">
                    <div>{{ res.customer_name }}</div>
                    <div class="text-[10px] text-slate-400 font-normal">{{ res.customer_phone }} • {{ res.customer_email }}</div>
                  </td>
                  <td class="py-3.5 px-2 font-medium">{{ res.reservation_date }} ({{ res.slot_start }})</td>
                  <td class="py-3.5 px-2">Table {{ res.table?.table_number || res.table_id }}</td>
                  <td class="py-3.5 px-2">{{ res.guests }}</td>
                  <td class="py-3.5 px-2">
                    <span 
                      [class]="res.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : (res.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : (res.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'))"
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {{ res.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2 text-right space-x-2">
                    <button (click)="openRescheduleModal(res)" class="text-xs font-bold text-amber-700 hover:underline">Reschedule</button>
                    <button *ngIf="res.status !== 'CONFIRMED'" (click)="updateStatus(res.id, 'CONFIRMED')" class="text-xs font-bold text-emerald-700 hover:underline">Confirm</button>
                    <button *ngIf="res.status !== 'COMPLETED'" (click)="updateStatus(res.id, 'COMPLETED')" class="text-xs font-bold text-blue-700 hover:underline">Complete</button>
                    <button *ngIf="res.status !== 'CANCELLED'" (click)="updateStatus(res.id, 'CANCELLED')" class="text-xs font-bold text-red-600 hover:underline">Cancel</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- RESCHEDULE RESERVATION MODAL -->
        <div *ngIf="reschedulingReservation()" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white dark:bg-[#142219] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-2xl space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#f4ede0] dark:border-[#1f3527]">
              <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-[#f3f4f6]">
                Reschedule Booking #{{ reschedulingReservation()?.id }}
              </h3>
              <button (click)="closeRescheduleModal()" class="text-slate-400 hover:text-black font-bold">✕</button>
            </div>

            <p class="text-xs text-slate-500">
              Guest: <span class="font-bold text-[#133820] dark:text-slate-200">{{ reschedulingReservation()?.customer_name }}</span> ({{ reschedulingReservation()?.guests }} guests)
            </p>

            <div class="space-y-3">
              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">New Date</label>
                <input type="date" [(ngModel)]="newResDate" class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
              </div>

              <div>
                <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">New Time Slot</label>
                <select [(ngModel)]="newResSlot" class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs">
                  <option value="11:30">11:30 AM (Lunch Service)</option>
                  <option value="12:30">12:30 PM (Lunch Service)</option>
                  <option value="13:30">01:30 PM (Afternoon)</option>
                  <option value="17:30">05:30 PM (Dinner Service)</option>
                  <option value="18:30">06:30 PM (Dinner Prime)</option>
                  <option value="19:30">07:30 PM (Dinner Prime)</option>
                  <option value="20:30">08:30 PM (Late Dinner)</option>
                  <option value="21:30">09:30 PM (Late Dinner)</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-3">
              <button (click)="closeRescheduleModal()" class="px-5 py-2 rounded-full text-xs font-bold border border-[#e2ded6]">
                Cancel
              </button>
              <button (click)="confirmReschedule()" class="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#133820] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md">
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 6: "OUR STORIES" BLOG CMS ENGINE -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'stories'" class="mt-8 space-y-8 animate-fade-in">
        
        <!-- Add / Edit Story Form -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-1">
            {{ editingStoryId ? 'Edit Editorial Story' : 'Write New Journal Article' }}
          </h2>
          <p class="text-xs text-slate-500 mb-6">Lightweight blog engine for food philosophy, recipes, and farm partner features.</p>

          <form [formGroup]="storyForm" (ngSubmit)="onSaveStory()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Article Title</label>
              <input type="text" formControlName="title" placeholder="e.g. Regenerative Soil & The Roots of Flavor" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select formControlName="category" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
                <option value="Harvest Stories">Harvest Stories</option>
                <option value="Culinary Craft">Culinary Craft</option>
                <option value="Farming Partners">Farming Partners</option>
                <option value="Food Philosophy">Food Philosophy</option>
              </select>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Author Name</label>
              <input type="text" formControlName="author_name" placeholder="Executive Chef Julian" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Reading Time (Minutes)</label>
              <input type="number" formControlName="reading_time_minutes" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Tags (comma separated)</label>
              <input type="text" formControlName="tags" placeholder="Organic, Soil, Farming" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Cover Image URL</label>
              <input type="url" formControlName="cover_image" placeholder="https://..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Or Upload Cover Image File</label>
              <input 
                type="file" 
                (change)="onUploadStoryCover($event)" 
                accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800">
            </div>

            <div class="sm:col-span-2 md:col-span-3">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Excerpt / Hook</label>
              <textarea formControlName="excerpt" rows="2" placeholder="Short description shown on card previews..." class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs"></textarea>
            </div>

            <div class="sm:col-span-2 md:col-span-3">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Full Article Content (Supports HTML paragraphs & headings)</label>
              <textarea formControlName="content" rows="6" placeholder="<p>Full rich story text goes here...</p>" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs font-mono"></textarea>
            </div>

            <div class="sm:col-span-2 md:col-span-3 flex items-center justify-between pt-2">
              <label class="flex items-center gap-2 text-xs font-bold text-[#19231a] dark:text-slate-300">
                <input type="checkbox" formControlName="is_published" class="w-4 h-4 text-emerald-600 rounded">
                Publish Live to Customers
              </label>

              <div class="flex gap-3">
                <button 
                  *ngIf="editingStoryId" 
                  type="button" 
                  (click)="cancelStoryEdit()" 
                  class="px-5 py-2.5 rounded-full text-xs font-bold border border-[#e2ded6]">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  [disabled]="storyForm.invalid"
                  class="px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all disabled:opacity-40">
                  {{ editingStoryId ? 'Update Story' : 'Publish Story' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Stories Table -->
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6] mb-4">Published Articles ({{ storyService.stories().length }})</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-[#f4ede0] dark:border-[#1f3527] text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th class="py-3 px-2">Article</th>
                  <th class="py-3 px-2">Category</th>
                  <th class="py-3 px-2">Author</th>
                  <th class="py-3 px-2">Status</th>
                  <th class="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#f4ede0] dark:divide-[#1f3527]">
                <tr *ngFor="let story of storyService.stories()">
                  <td class="py-3.5 px-2 font-bold text-[#133820] dark:text-slate-100 flex items-center gap-3">
                    <img [src]="story.cover_image || '/hero_table_banner.jpg'" class="w-10 h-10 rounded-xl object-cover">
                    <span>{{ story.title }}</span>
                  </td>
                  <td class="py-3.5 px-2 text-slate-500">{{ story.category }}</td>
                  <td class="py-3.5 px-2 text-slate-500">{{ story.author || story.author_name }}</td>
                  <td class="py-3.5 px-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {{ story.is_published ? 'Published' : 'Draft' }}
                    </span>
                  </td>
                  <td class="py-3.5 px-2 text-right space-x-3">
                    <button (click)="startStoryEdit(story)" class="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Edit</button>
                    <button (click)="deleteStory(story.id, story.title)" class="text-red-600 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- TAB 7: FOOTER CMS -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'footer'" class="mt-8 space-y-6 animate-fade-in">
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4ede0] dark:border-[#1f3527] mb-6">
            <div>
              <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Footer CMS & Social Links</h2>
              <p class="text-xs text-slate-500 mt-0.5">Edit footer brand summary, copyright notice, background styling, and social media links.</p>
            </div>
            <button 
              (click)="saveHeroCopy()" 
              class="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md transition-all">
              Save Footer Settings
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Footer About & Philosophy Text</label>
              <textarea [(ngModel)]="cmsDraft['footer_about_text']" rows="3" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs"></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Copyright Notice Text</label>
              <input type="text" [(ngModel)]="cmsDraft['footer_copyright']" class="w-full px-4 py-3 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Footer Background Color</label>
              <div class="flex items-center gap-3">
                <input type="color" [(ngModel)]="cmsDraft['footer_bg_color']" class="w-12 h-10 rounded-xl cursor-pointer border border-[#e2ded6]">
                <input type="text" [(ngModel)]="cmsDraft['footer_bg_color']" class="flex-1 px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-xl text-xs font-mono">
              </div>
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Instagram Profile URL</label>
              <input type="url" [(ngModel)]="cmsDraft['social_instagram']" class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Facebook Page URL</label>
              <input type="url" [(ngModel)]="cmsDraft['social_facebook']" class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">Twitter / X URL</label>
              <input type="url" [(ngModel)]="cmsDraft['social_twitter']" class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>

            <div>
              <label class="block text-xs uppercase font-bold text-slate-600 dark:text-slate-400 mb-1">YouTube Channel URL</label>
              <input type="url" [(ngModel)]="cmsDraft['social_youtube']" class="w-full px-4 py-2.5 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-2xl text-xs">
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- TAB 8: REVIEW MODERATION QUEUE -->
      <!-- =================================================================== -->
      <div *ngIf="activeTab() === 'reviews'" class="mt-8 space-y-6 animate-fade-in">
        <div class="bg-white dark:bg-[#142219] rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          <div class="flex items-center justify-between pb-4 border-b border-[#f4ede0] dark:border-[#1f3527] mb-6">
            <div>
              <h2 class="font-serif text-2xl font-bold text-[#133820] dark:text-[#f3f4f6]">Customer Review Moderation Queue</h2>
              <p class="text-xs text-slate-500 mt-0.5">Approve or reject customer submitted feedback before public display.</p>
            </div>
            <button (click)="loadAllReviews()" class="px-5 py-2 rounded-full border border-[#e8e4dc] dark:border-[#1f3527] text-xs font-bold hover:bg-[#faf8f5]">
              🔄 Refresh
            </button>
          </div>

          <div *ngIf="allReviews().length === 0" class="py-12 text-center text-slate-500 text-xs">
            No reviews in moderation queue.
          </div>

          <div *ngIf="allReviews().length > 0" class="space-y-4">
            <div 
              *ngFor="let rev of allReviews()" 
              class="p-5 rounded-2xl bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e8e4dc] dark:border-[#1f3527] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-sm text-[#133820] dark:text-slate-100">{{ rev.customer_name }}</span>
                  <span class="text-amber-500 text-xs font-bold">★ {{ rev.rating }}/5</span>
                  <span 
                    [class]="rev.is_approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ rev.is_approved ? 'Live on Site' : 'Pending Approval' }}
                  </span>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300 italic">"{{ rev.comment }}"</p>
                <p class="text-[10px] text-slate-400">{{ rev.created_at | date:'medium' }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button 
                  (click)="moderateReview(rev.id, !rev.is_approved)" 
                  [class]="rev.is_approved ? 'border-amber-600 text-amber-700' : 'bg-emerald-700 text-white'"
                  class="px-4 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-sm">
                  {{ rev.is_approved ? 'Revoke Approval' : 'Approve Review' }}
                </button>
                <button (click)="deleteReview(rev.id, rev.customer_name)" class="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminComponent implements OnInit {
  contentService = inject(ContentService);
  menuService = inject(MenuService);
  resvService = inject(ReservationService);
  reviewService = inject(ReviewService);
  navService = inject(NavigationService);
  branchService = inject(BranchService);
  bannerSlideService = inject(BannerSlideService);
  storyService = inject(StoryService);
  toastService = inject(ToastService);
  dialogService = inject(DialogService);
  dynamicPageService = inject(DynamicPageService);
  route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  readonly activeTab = signal<AdminTab>('nav');
  cmsDraft: Record<string, string> = {};

  readonly allReservations = signal<Reservation[]>([]);
  readonly allReviews = signal<Review[]>([]);
  readonly reschedulingReservation = signal<Reservation | null>(null);
  newResDate = '';
  newResSlot = '18:30';

  // Dynamic Pages CMS state
  readonly selectedPage = signal<DynamicPage | null>(null);

  // Navigation CRUD state
  editingNavId: number | null = null;
  readonly navForm = this.fb.group({
    label: ['', Validators.required],
    route: ['', Validators.required],
    display_order: [1, [Validators.required, Validators.min(0)]],
    is_active: [true],
    is_external: [false],
    create_page: [true],
    page_title: [''],
    page_subtitle: ['']
  });

  // Banner Slide CRUD state
  editingSlideId: number | null = null;
  readonly slideForm = this.fb.group({
    title: ['', Validators.required],
    subtitle: [''],
    image_url: ['', Validators.required],
    badge_text: [''],
    cta_text: ['Make a Reservation'],
    cta_link: ['/reserve'],
    display_order: [1, Validators.required],
    is_active: [true]
  });

  // Menu Dish CRUD state
  editingItemId: number | null = null;
  readonly itemForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category_id: [1, Validators.required],
    price: [18.00, [Validators.required, Validators.min(0)]],
    description: [''],
    photo_url: [''],
    tags: [''],
    is_chef_special: [false],
    is_top_recipe: [false]
  });

  // Branch CRUD state
  editingBranchId: number | null = null;
  readonly branchForm = this.fb.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    state: ['CA'],
    zip_code: [''],
    address: ['', Validators.required],
    phone: [''],
    latitude: [37.7749, Validators.required],
    longitude: [-122.4194, Validators.required],
    operating_hours: ['Mon - Sun: 11:00 AM – 10:00 PM'],
    is_active: [true]
  });

  // Story CRUD state
  editingStoryId: number | null = null;
  readonly storyForm = this.fb.group({
    title: ['', Validators.required],
    category: ['Harvest Stories', Validators.required],
    author_name: ['Executive Chef Julian'],
    reading_time_minutes: [4, Validators.min(1)],
    cover_image: [''],
    excerpt: ['', Validators.required],
    content: ['', Validators.required],
    tags: ['Organic, Farm-to-Table'],
    is_published: [true]
  });

  ngOnInit(): void {
    this.cmsDraft = {
      theme_primary_color: '#133820',
      theme_accent_color: '#d97706',
      footer_bg_color: '#133820',
      footer_about_text: 'A scratch culinary sanctuary celebrating plant-forward bowls, wild harvests, and sustainable grower partnerships.',
      footer_copyright: '© 2026 Aura Bistro. All rights reserved.',
      social_instagram: 'https://instagram.com',
      social_facebook: 'https://facebook.com',
      social_twitter: 'https://twitter.com',
      social_youtube: 'https://youtube.com',
      ...this.contentService.contents()
    };

    this.contentService.loadContent().subscribe({
      next: (data) => {
        this.cmsDraft = { ...this.cmsDraft, ...data };
      }
    });

    this.navService.loadNavItems().subscribe();
    this.dynamicPageService.loadAllPages().subscribe();
    this.menuService.loadCategories().subscribe();
    this.menuService.loadItems().subscribe();
    this.branchService.loadBranches().subscribe();
    this.bannerSlideService.loadActiveSlides().subscribe();
    this.storyService.loadPublishedStories().subscribe();
    this.loadAllReservations();
    this.loadAllReviews();

    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.activeTab.set(params['tab'] as AdminTab);
      }
      if (params['edit_page']) {
        const slug = params['edit_page'];
        this.openDynamicPageEditorBySlug(slug);
      }
    });
  }

  // ===================================================================
  // THEME & CMS ACTIONS
  // ===================================================================
  applyPalette(primary: string, accent: string): void {
    this.cmsDraft['theme_primary_color'] = primary;
    this.cmsDraft['theme_accent_color'] = accent;
    this.cmsDraft['footer_bg_color'] = primary;
  }

  saveThemeColors(): void {
    this.saveHeroCopy('Theme colors and styling updated!');
  }

  saveHeroCopy(msg: string = 'CMS settings saved and published!'): void {
    this.contentService.updateBulk(this.cmsDraft).subscribe({
      next: () => {
        this.toastService.success(msg);
      },
      error: (err) => {
        this.toastService.error(err.error?.detail || 'Failed to save settings.');
      }
    });
  }

  onUploadLogo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.contentService.uploadAsset(input.files[0]).subscribe({
        next: (res) => {
          this.cmsDraft['brand_logo_url'] = res.url;
          this.saveHeroCopy('Brand logo uploaded and published!');
        },
        error: () => this.toastService.error('Error uploading logo image.')
      });
    }
  }

  // ===================================================================
  // NAVIGATION ACTIONS
  // ===================================================================
  onSaveNavItem(): void {
    if (this.navForm.invalid) return;
    const val = this.navForm.value;

    if (this.editingNavId) {
      this.navService.updateNavItem(this.editingNavId, val as Partial<NavItem>).subscribe({
        next: () => {
          this.toastService.success('Navigation link updated successfully!');
          this.cancelNavEdit();
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to update navigation link');
        }
      });
    } else {
      this.navService.createNavItem(val as any).subscribe({
        next: (res) => {
          const hasPage = val.create_page;
          this.toastService.success(`Navigation link created!${hasPage ? ' Associated page template generated.' : ''}`);
          this.navForm.reset({
            display_order: this.navService.navItems().length + 1,
            is_active: true,
            is_external: false,
            create_page: true,
            page_title: '',
            page_subtitle: ''
          });
          this.dynamicPageService.loadAllPages().subscribe();
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to create navigation item.');
        }
      });
    }
  }

  startNavEdit(item: NavItem): void {
    this.editingNavId = item.id;
    this.navForm.patchValue({
      label: item.label,
      route: item.route,
      display_order: item.display_order,
      is_active: item.is_active,
      is_external: item.is_external
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  cancelNavEdit(): void {
    this.editingNavId = null;
    this.navForm.reset({ display_order: 1, is_active: true, is_external: false, create_page: true });
  }

  async deleteNavItem(id: number, label?: string): Promise<void> {
    const itemName = label || 'Navigation item';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Navigation Link',
      message: `Are you sure you want to permanently delete "${itemName}"? Any associated page template will be unlinked.`,
      confirmText: 'Delete Link',
      type: 'danger',
      itemName: itemName
    });
    if (!confirmed) return;

    this.navService.deleteNavItem(id).subscribe({
      next: () => {
        this.toastService.success(`Deleted navigation link: ${itemName}`);
        this.navService.loadNavItems().subscribe();
        this.dynamicPageService.loadAllPages().subscribe();
      },
      error: (err) => {
        console.error('Delete nav item error:', err);
        this.toastService.error('Error deleting navigation item.');
        this.navService.loadNavItems().subscribe();
      }
    });
  }

  // ===================================================================
  // DYNAMIC PAGES CMS ACTIONS
  // ===================================================================
  openPageEditor(page: DynamicPage): void {
    // Clone page so changes aren't prematurely mutated in list
    this.selectedPage.set(JSON.parse(JSON.stringify(page)));
    this.activeTab.set('dynamic-pages');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }

  openDynamicPageEditorBySlug(slug: string): void {
    const cleanSlug = slug.replace(/^\//, '');
    const found = this.dynamicPageService.pages().find((p) => p.slug === cleanSlug);
    if (found) {
      this.openPageEditor(found);
    } else {
      this.dynamicPageService.getPageBySlug(cleanSlug).subscribe({
        next: (p) => {
          this.openPageEditor(p);
        },
        error: () => {
          this.toastService.info(`No page template exists for "/${cleanSlug}". You can scaffold one below.`);
          this.activeTab.set('dynamic-pages');
        }
      });
    }
  }

  createNewPageDraft(): void {
    const defaultPage: DynamicPage = {
      id: 0,
      slug: `custom-page-${Date.now().toString().slice(-4)}`,
      title: 'New Page Experience',
      subtitle: 'An artisanal dining experience curated for our guests.',
      is_published: true,
      hero_slides: [
        {
          image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
          title: 'Culinary Artistry & Heritage',
          subtitle: 'Every plate is an invitation to experience organic, sustainable gastronomy at its finest.',
          badge_text: 'AURA SIGNATURE',
          caption: 'ORGANIC HARVEST',
          button_primary_text: 'Reserve a Table',
          button_primary_link: '/reserve',
          button_secondary_text: 'View Menu',
          button_secondary_link: '/menu'
        }
      ],
      content_blocks: [
        {
          block_type: 'split_content',
          badge: 'OUR PHILOSOPHY',
          heading: 'Crafted with Purpose, Served with Soul',
          subheading: 'Connecting you with local growers and sustainable farms.',
          body: '<p>At Aura Bistro, every ingredient tells a tale of soil, sun, and stewardship. We partner directly with organic family farms within a 100-mile radius to source produce picked that morning.</p><p>Our open kitchen prepares seasonal creations where nature takes center stage.</p>',
          image_url: 'https://images.unsplash.com/photo-1507048821117-6573c20c5eaf?auto=format&fit=crop&w=1200&q=80',
          button_text: 'Explore Our Story',
          button_link: '/stories'
        },
        {
          block_type: 'feature_grid',
          badge: 'WHY DINE WITH US',
          heading: 'The Aura Difference',
          subheading: 'Unwavering standards in hospitality, sustainability, and culinary craft.',
          items: [
            { icon: '🌿', title: '100% Organic & Non-GMO', description: 'Certified farm-to-table produce harvested daily.' },
            { icon: '🔥', title: 'Artisan Wood-Fired', description: 'Infusing deep smoky sweetness into wild roots and heirloom grains.' },
            { icon: '🍷', title: 'Biodynamic Wine Pairing', description: 'Natural low-intervention wines chosen by certified sommeliers.' }
          ]
        },
        {
          block_type: 'cta_banner',
          badge: 'JOIN US',
          heading: 'Reserve Your Evening at Aura Bistro',
          subheading: 'Intimate seating, bespoke tasting menus, and unforgettable moments.',
          button_text: 'Book a Table Now',
          button_link: '/reserve'
        }
      ]
    };
    this.selectedPage.set(defaultPage);
  }

  saveSelectedPage(): void {
    const page = this.selectedPage();
    if (!page) return;

    if (!page.slug || !page.title) {
      this.toastService.error('Page title and route slug are required.');
      return;
    }

    page.slug = page.slug.trim().toLowerCase().replace(/^\//, '').replace(/\s+/g, '-');

    if (page.id && page.id > 0) {
      this.dynamicPageService.updatePage(page.id, page).subscribe({
        next: (updated) => {
          this.selectedPage.set(updated);
          this.toastService.success(`Page "/${updated.slug}" saved and published!`);
          this.dynamicPageService.loadAllPages().subscribe();
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to update dynamic page.');
        }
      });
    } else {
      this.dynamicPageService.createPage(page).subscribe({
        next: (created) => {
          this.selectedPage.set(created);
          this.toastService.success(`New page "/${created.slug}" created and live!`);
          this.dynamicPageService.loadAllPages().subscribe();
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to create dynamic page.');
        }
      });
    }
  }

  async deletePage(id: number, title?: string): Promise<void> {
    const pageTitle = title || 'Dynamic page';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Dynamic Page',
      message: `Are you sure you want to permanently delete the page "${pageTitle}"? This will unpublish its route and layout template.`,
      confirmText: 'Delete Page',
      type: 'danger',
      itemName: pageTitle
    });
    if (!confirmed) return;

    this.dynamicPageService.deletePage(id).subscribe({
      next: () => {
        this.toastService.success(`Deleted dynamic page: ${pageTitle}`);
        if (this.selectedPage()?.id === id) {
          this.selectedPage.set(null);
        }
        this.dynamicPageService.loadAllPages().subscribe();
        this.navService.loadNavItems().subscribe();
      },
      error: (err) => {
        this.toastService.error(err.error?.detail || 'Error deleting dynamic page.');
      }
    });
  }

  addHeroSlideToSelectedPage(): void {
    const page = this.selectedPage();
    if (!page) return;
    if (!page.hero_slides) page.hero_slides = [];
    page.hero_slides.push({
      image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
      title: 'Seasonal Culinary Experience',
      subtitle: 'Fresh, organic creations crafted to perfection.',
      badge_text: 'SPECIAL TASTING',
      caption: 'FARM FRESH',
      button_primary_text: 'Reserve Now',
      button_primary_link: '/reserve',
      button_secondary_text: 'Explore Menu',
      button_secondary_link: '/menu'
    });
    this.toastService.info('New slide added. Remember to click "Save Layout Changes".');
  }

  removeHeroSlide(index: number): void {
    const page = this.selectedPage();
    if (!page || !page.hero_slides) return;
    page.hero_slides.splice(index, 1);
  }

  uploadSlideImage(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.dynamicPageService.uploadAsset(input.files[0]).subscribe({
        next: (res) => {
          const page = this.selectedPage();
          if (page && page.hero_slides && page.hero_slides[index]) {
            page.hero_slides[index].image_url = res.url;
            this.toastService.success('Slide image uploaded successfully!');
          }
        },
        error: () => this.toastService.error('Failed to upload slide image.')
      });
    }
  }

  addContentBlock(type: 'rich_text' | 'split_content' | 'feature_grid' | 'cta_banner'): void {
    const page = this.selectedPage();
    if (!page) return;
    if (!page.content_blocks) page.content_blocks = [];

    if (type === 'rich_text') {
      page.content_blocks.push({
        block_type: 'rich_text',
        badge: 'EDITORIAL',
        heading: 'New Editorial Section',
        subheading: 'Add your story, philosophy, or news here.',
        body: '<p>Compose rich paragraphs, highlighting seasonal specialties, team bios, or sustainable sourcing practices.</p>'
      });
    } else if (type === 'split_content') {
      page.content_blocks.push({
        block_type: 'split_content',
        badge: 'HIGHLIGHT',
        heading: 'Signature Focus',
        subheading: 'A curated spotlight section.',
        body: '<p>Detailed description emphasizing craft, quality, and hospitality.</p>',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        button_text: 'Learn More',
        button_link: '/menu'
      });
    } else if (type === 'feature_grid') {
      page.content_blocks.push({
        block_type: 'feature_grid',
        badge: 'AMENITIES',
        heading: 'Experience Highlights',
        subheading: 'Features and amenities tailored for our guests.',
        items: [
          { icon: '🥂', title: 'Private Sommelier', description: 'Expert guidance through natural and biodynamic cellars.' },
          { icon: '🌿', title: 'Seasonal Tasting', description: 'Seven courses synchronized with local harvest dates.' }
        ]
      });
    } else if (type === 'cta_banner') {
      page.content_blocks.push({
        block_type: 'cta_banner',
        badge: 'RESERVATIONS',
        heading: 'Ready for an Unforgettable Dining Experience?',
        subheading: 'Reserve your table today and immerse yourself in exceptional flavors.',
        button_text: 'Book a Table',
        button_link: '/reserve'
      });
    }
    this.toastService.info(`Added ${type.replace('_', ' ')} block. Remember to click "Save Layout Changes".`);
  }

  removeContentBlock(index: number): void {
    const page = this.selectedPage();
    if (!page || !page.content_blocks) return;
    page.content_blocks.splice(index, 1);
  }

  uploadBlockImage(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.dynamicPageService.uploadAsset(input.files[0]).subscribe({
        next: (res) => {
          const page = this.selectedPage();
          if (page && page.content_blocks && page.content_blocks[index]) {
            page.content_blocks[index].image_url = res.url;
            this.toastService.success('Block image uploaded successfully!');
          }
        },
        error: () => this.toastService.error('Failed to upload block image.')
      });
    }
  }

  addFeatureItem(block: ContentBlockItem): void {
    if (!block.items) block.items = [];
    block.items.push({
      icon: '✨',
      title: 'New Feature',
      description: 'Feature description goes here.'
    });
  }

  removeFeatureItem(block: ContentBlockItem, index: number): void {
    if (!block.items) return;
    block.items.splice(index, 1);
  }

  // ===================================================================
  // BANNER SLIDES ACTIONS
  // ===================================================================
  onUploadSlideImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.contentService.uploadAsset(input.files[0]).subscribe({
        next: (res) => {
          this.slideForm.patchValue({ image_url: res.url });
        },
        error: () => this.toastService.error('Failed to upload slide image.')
      });
    }
  }

  onSaveSlide(): void {
    if (this.slideForm.invalid) return;
    const val = this.slideForm.value;

    if (this.editingSlideId) {
      this.bannerSlideService.updateSlide(this.editingSlideId, val as Partial<BannerSlide>).subscribe({
        next: () => {
          this.toastService.success('Banner slide updated!');
          this.cancelSlideEdit();
          this.bannerSlideService.loadActiveSlides().subscribe();
        },
        error: (err) => {
          console.error('Update slide error:', err);
          this.toastService.error('Error updating slide.');
        }
      });
    } else {
      this.bannerSlideService.createSlide(val as Partial<BannerSlide>).subscribe({
        next: () => {
          this.toastService.success('New banner slide added to slider!');
          this.slideForm.reset({
            display_order: this.bannerSlideService.slides().length + 1,
            is_active: true,
            cta_text: 'Make a Reservation',
            cta_link: '/reserve'
          });
          this.bannerSlideService.loadActiveSlides().subscribe();
        },
        error: (err) => {
          console.error('Create slide error:', err);
          this.toastService.error('Error creating slide.');
        }
      });
    }
  }

  startSlideEdit(s: BannerSlide): void {
    this.editingSlideId = s.id;
    this.slideForm.patchValue({
      title: s.title,
      subtitle: s.subtitle,
      image_url: s.image_url,
      badge_text: s.badge_text,
      cta_text: s.button_primary_text || s.cta_text || '',
      cta_link: s.button_primary_link || s.cta_link || '',
      display_order: s.display_order,
      is_active: s.is_active
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.toastService.info(`Editing banner slide: ${s.title}`);
  }

  cancelSlideEdit(): void {
    this.editingSlideId = null;
    this.slideForm.reset({ display_order: 1, is_active: true, cta_text: 'Make a Reservation', cta_link: '/reserve' });
  }

  async deleteSlide(id: number, title?: string): Promise<void> {
    const slideTitle = title || 'Banner slide';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Hero Slide',
      message: `Are you sure you want to delete the hero slide "${slideTitle}"?`,
      confirmText: 'Delete Slide',
      type: 'danger',
      itemName: slideTitle
    });
    if (!confirmed) return;

    this.bannerSlideService.deleteSlide(id).subscribe({
      next: () => {
        this.toastService.success(`Banner slide removed: ${slideTitle}`);
        this.bannerSlideService.loadActiveSlides().subscribe();
      },
      error: (err) => {
        console.error('Delete slide error:', err);
        this.toastService.error('Error deleting banner slide.');
        this.bannerSlideService.loadActiveSlides().subscribe();
      }
    });
  }

  // ===================================================================
  // MENU DISH ACTIONS
  // ===================================================================
  onUploadDishImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.contentService.uploadAsset(input.files[0]).subscribe({
        next: (res) => {
          this.itemForm.patchValue({ photo_url: res.url });
        },
        error: () => this.toastService.error('Failed to upload dish image.')
      });
    }
  }

  onAddItem(): void {
    if (this.itemForm.invalid) return;
    const val = this.itemForm.value;

    if (this.editingItemId) {
      this.menuService.updateItem(this.editingItemId, val as Partial<MenuItem>).subscribe({
        next: () => {
          this.toastService.success('Artisan dish updated successfully!');
          this.cancelDishEdit();
          this.menuService.loadItems().subscribe();
        },
        error: (err) => {
          console.error('Update dish error:', err);
          this.toastService.error('Error updating dish.');
        }
      });
    } else {
      this.menuService.createItem(val as Partial<MenuItem>).subscribe({
        next: () => {
          this.toastService.success('New artisan dish added successfully!');
          this.itemForm.reset({ category_id: 1, price: 18.00 });
          this.menuService.loadItems().subscribe();
        },
        error: (err) => {
          console.error('Create dish error:', err);
          this.toastService.error('Error adding dish.');
        }
      });
    }
  }

  startDishEdit(item: MenuItem): void {
    this.editingItemId = item.id;
    this.itemForm.patchValue({
      name: item.name,
      category_id: item.category_id,
      price: item.price,
      description: item.description || '',
      photo_url: item.photo_url || '',
      tags: item.tags || '',
      is_chef_special: item.is_chef_special,
      is_top_recipe: item.is_top_recipe
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.toastService.info(`Editing dish: ${item.name}`);
  }

  cancelDishEdit(): void {
    this.editingItemId = null;
    this.itemForm.reset({ category_id: 1, price: 18.00 });
  }

  toggleStock(id: number): void {
    this.menuService.toggleStock(id).subscribe({
      next: (updated) => {
        this.toastService.info(`Stock updated for ${updated.name}`);
      },
      error: () => this.toastService.error('Failed to update stock status.')
    });
  }

  async deleteDish(id: number, name?: string): Promise<void> {
    const dishName = name || 'Menu dish';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Menu Dish',
      message: `Are you sure you want to delete "${dishName}" from the menu catalog?`,
      confirmText: 'Delete Dish',
      type: 'danger',
      itemName: dishName
    });
    if (!confirmed) return;

    this.menuService.deleteItem(id).subscribe({
      next: () => {
        this.toastService.success(`Dish removed from menu: ${dishName}`);
        this.menuService.loadItems().subscribe();
      },
      error: (err) => {
        console.error('Delete dish error:', err);
        this.toastService.error('Error deleting dish.');
        this.menuService.loadItems().subscribe();
      }
    });
  }

  // ===================================================================
  // STORE LOCATOR / BRANCHES ACTIONS
  // ===================================================================
  onSaveBranch(): void {
    if (this.branchForm.invalid) return;
    const val = this.branchForm.value;

    if (this.editingBranchId) {
      this.branchService.updateBranch(this.editingBranchId, val as Partial<Branch>).subscribe({
        next: () => {
          this.toastService.success('Branch details updated successfully!');
          this.cancelBranchEdit();
          this.branchService.loadBranches().subscribe();
        },
        error: (err) => {
          console.error('Update branch error:', err);
          this.toastService.error('Error updating branch details.');
        }
      });
    } else {
      this.branchService.createBranch(val as Partial<Branch>).subscribe({
        next: () => {
          this.toastService.success('New branch added to Store Locator!');
          this.branchForm.reset({
            state: 'CA',
            is_active: true,
            latitude: 37.7749,
            longitude: -122.4194,
            operating_hours: 'Mon - Sun: 11:00 AM – 10:00 PM'
          });
          this.branchService.loadBranches().subscribe();
        },
        error: (err) => {
          console.error('Create branch error:', err);
          this.toastService.error('Error creating branch.');
        }
      });
    }
  }

  startBranchEdit(b: Branch): void {
    this.editingBranchId = b.id;
    this.branchForm.patchValue({
      name: b.name,
      city: b.city,
      state: b.state || 'CA',
      zip_code: b.zip_code || '',
      address: b.address,
      phone: b.phone || '',
      latitude: b.latitude,
      longitude: b.longitude,
      operating_hours: b.opening_hours || b.operating_hours || 'Mon - Sun: 11:00 AM – 10:00 PM',
      is_active: b.is_active
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.toastService.info(`Editing branch: ${b.name}`);
  }

  cancelBranchEdit(): void {
    this.editingBranchId = null;
    this.branchForm.reset({
      state: 'CA',
      is_active: true,
      latitude: 37.7749,
      longitude: -122.4194,
      operating_hours: 'Mon - Sun: 11:00 AM – 10:00 PM'
    });
  }

  async deleteBranch(id: number, name?: string): Promise<void> {
    const branchName = name || 'Store branch';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Store Location',
      message: `Are you sure you want to delete the branch "${branchName}" from the store locator?`,
      confirmText: 'Delete Branch',
      type: 'danger',
      itemName: branchName
    });
    if (!confirmed) return;

    this.branchService.deleteBranch(id).subscribe({
      next: () => {
        this.toastService.success(`Branch deleted from Store Locator: ${branchName}`);
        this.branchService.loadBranches().subscribe();
      },
      error: (err) => {
        console.error('Delete branch error:', err);
        this.toastService.error('Error deleting branch.');
        this.branchService.loadBranches().subscribe();
      }
    });
  }

  // ===================================================================
  // RESERVATIONS & RESCHEDULE ACTIONS
  // ===================================================================
  loadAllReservations(): void {
    this.resvService.getAllReservations().subscribe({
      next: (list) => this.allReservations.set(list)
    });
  }

  updateStatus(id: number, status: string): void {
    this.resvService.updateReservationStatus(id, status).subscribe({
      next: () => {
        this.toastService.success(`Reservation #${id} updated to ${status}`);
        this.loadAllReservations();
      },
      error: () => this.toastService.error('Failed to update reservation status.')
    });
  }

  openRescheduleModal(res: Reservation): void {
    this.reschedulingReservation.set(res);
    this.newResDate = res.reservation_date;
    this.newResSlot = res.slot_start || '18:30';
  }

  closeRescheduleModal(): void {
    this.reschedulingReservation.set(null);
  }

  confirmReschedule(): void {
    const res = this.reschedulingReservation();
    if (!res || !this.newResDate || !this.newResSlot) return;

    // Calculate end slot approx 1.5h later
    const [h, m] = this.newResSlot.split(':').map(Number);
    const endH = (h + 1).toString().padStart(2, '0');
    const endSlot = `${endH}:${m === 30 ? '00' : '30'}`;

    this.resvService
      .rescheduleReservation(res.id, {
        reservation_date: this.newResDate,
        slot_start: this.newResSlot,
        slot_end: endSlot
      })
      .subscribe({
        next: () => {
          this.toastService.success(
            `Reservation #${res.id} successfully rescheduled to ${this.newResDate} at ${this.newResSlot}!`
          );
          this.closeRescheduleModal();
          this.loadAllReservations();
        },
        error: (err) => {
          this.toastService.error(
            err.error?.detail || 'Failed to reschedule reservation. Slot may be unavailable.'
          );
        }
      });
  }

  // ===================================================================
  // "OUR STORIES" BLOG ACTIONS
  // ===================================================================
  onUploadStoryCover(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.contentService.uploadAsset(input.files[0]).subscribe({
        next: (res) => {
          this.storyForm.patchValue({ cover_image: res.url });
        },
        error: () => this.toastService.error('Failed to upload cover image.')
      });
    }
  }

  onSaveStory(): void {
    if (this.storyForm.invalid) return;
    const val = this.storyForm.value;

    if (this.editingStoryId) {
      this.storyService.updateStory(this.editingStoryId, val as Partial<Story>).subscribe({
        next: () => {
          this.toastService.success('Article updated successfully!');
          this.cancelStoryEdit();
          this.storyService.loadPublishedStories().subscribe();
        },
        error: (err) => {
          console.error('Update story error:', err);
          this.toastService.error('Error updating article.');
        }
      });
    } else {
      this.storyService.createStory(val as Partial<Story>).subscribe({
        next: () => {
          this.toastService.success('New article published to "Our Stories"!');
          this.storyForm.reset({
            category: 'Harvest Stories',
            author_name: 'Executive Chef Julian',
            reading_time_minutes: 4,
            is_published: true
          });
          this.storyService.loadPublishedStories().subscribe();
        },
        error: (err) => {
          console.error('Create story error:', err);
          this.toastService.error('Error publishing article.');
        }
      });
    }
  }

  startStoryEdit(s: Story): void {
    this.editingStoryId = s.id;
    this.storyForm.patchValue({
      title: s.title,
      category: s.category,
      author_name: s.author_name || s.author || 'Executive Chef Julian',
      reading_time_minutes: s.reading_time_minutes || 4,
      cover_image: s.cover_image,
      excerpt: s.excerpt,
      content: s.content,
      tags: s.tags || 'Organic, Farm-to-Table',
      is_published: s.is_published
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.toastService.info(`Editing story: ${s.title}`);
  }

  cancelStoryEdit(): void {
    this.editingStoryId = null;
    this.storyForm.reset({
      category: 'Harvest Stories',
      author_name: 'Executive Chef Julian',
      reading_time_minutes: 4,
      is_published: true
    });
  }

  async deleteStory(id: number, title?: string): Promise<void> {
    const storyTitle = title || 'Story article';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Article',
      message: `Are you sure you want to delete "${storyTitle}" from published stories?`,
      confirmText: 'Delete Story',
      type: 'danger',
      itemName: storyTitle
    });
    if (!confirmed) return;

    this.storyService.deleteStory(id).subscribe({
      next: () => {
        this.toastService.success(`Story article deleted: ${storyTitle}`);
        this.storyService.loadPublishedStories().subscribe();
      },
      error: (err) => {
        console.error('Delete story error:', err);
        this.toastService.error('Error deleting story article.');
        this.storyService.loadPublishedStories().subscribe();
      }
    });
  }

  // ===================================================================
  // REVIEWS MODERATION ACTIONS
  // ===================================================================
  loadAllReviews(): void {
    this.reviewService.loadAllReviewsAdmin().subscribe({
      next: (list) => this.allReviews.set(list)
    });
  }

  moderateReview(id: number, isApproved: boolean): void {
    this.reviewService.moderateReview(id, isApproved).subscribe({
      next: () => {
        this.toastService.success(`Review ${isApproved ? 'approved' : 'revoked'}`);
        this.loadAllReviews();
      },
      error: () => this.toastService.error('Failed to moderate review.')
    });
  }

  async deleteReview(id: number, customerName?: string): Promise<void> {
    const author = customerName || 'Customer review';
    const confirmed = await this.dialogService.confirm({
      title: 'Delete Customer Review',
      message: `Are you sure you want to delete the review by "${author}"?`,
      confirmText: 'Delete Review',
      type: 'danger',
      itemName: `Review by ${author}`
    });
    if (!confirmed) return;

    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.toastService.success(`Review deleted: ${author}`);
        this.loadAllReviews();
      },
      error: (err) => {
        console.error('Delete review error:', err);
        this.toastService.error('Error deleting review.');
        this.loadAllReviews();
      }
    });
  }
}

