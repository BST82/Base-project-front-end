import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoryService } from '../core/services/story.service';
import { Story } from '../core/models';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-[#f3f4f6] transition-colors duration-200">
      
      <!-- HERO EDITORIAL BANNER -->
      <section class="border-b border-[#e8e4dc] dark:border-[#1f3527] bg-[#f5f0e6] dark:bg-[#111d15] py-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center space-y-4">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#133820] dark:bg-[#22c55e] text-[#faf8f5] dark:text-[#0c1510] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>📖 Editorial & Harvest Journal</span>
          </div>
          <h1 class="font-serif text-4xl sm:text-6xl font-black text-[#133820] dark:text-[#f3f4f6] tracking-tight">
            Our Stories & Philosophy
          </h1>
          <p class="text-sm sm:text-base text-[#19231a]/80 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Behind every seasonal plate is a community of growers, regenerative soil, and intentional craft. Discover our culinary journey from seed to table.
          </p>
        </div>
      </section>

      <!-- MAIN CONTAINER -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        <!-- CATEGORY PILLS BAR -->
        <div class="flex flex-wrap items-center justify-center gap-2 pb-6 border-b border-[#e8e4dc] dark:border-[#1f3527]">
          <button 
            *ngFor="let cat of categories()"
            (click)="selectCategory(cat)"
            [class]="selectedCategory() === cat ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-white dark:bg-[#142219] text-[#19231a] dark:text-slate-300 hover:bg-[#ede8df] dark:hover:bg-[#1f3527]'"
            class="px-5 py-2.5 rounded-full text-xs transition-all border border-[#e2ded6] dark:border-[#1f3527]">
            {{ cat }}
          </button>
        </div>

        <!-- LOADING SKELETON -->
        <div *ngIf="storyService.loading()" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div *ngFor="let i of [1,2,3]" class="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        </div>

        <!-- NO STORIES FOUND -->
        <div *ngIf="!storyService.loading() && storyService.stories().length === 0" class="py-16 text-center text-slate-500 text-sm">
          No stories published in this category yet. Check back soon for harvest updates!
        </div>

        <!-- STORIES GRID -->
        <div *ngIf="!storyService.loading() && storyService.stories().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            *ngFor="let story of storyService.stories()"
            (click)="openStory(story)"
            class="bg-white dark:bg-[#142219] rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] hover:border-emerald-600/50 dark:hover:border-emerald-400/50 shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group">
            
            <!-- Cover Photo -->
            <div class="relative h-60 overflow-hidden bg-[#f4ede0] dark:bg-[#0c1510]">
              <img 
                [src]="story.cover_image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'" 
                [alt]="story.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#133820]/90 text-white dark:bg-[#22c55e] dark:text-[#0c1510] backdrop-blur-sm shadow-md">
                {{ story.category }}
              </span>
              <span class="absolute bottom-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-sm">
                ⏱ {{ story.read_time || '4 min read' }}
              </span>
            </div>

            <!-- Content Area -->
            <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="text-[11px] text-slate-400">
                  {{ story.created_at | date:'longDate' }} • By {{ story.author || 'Aura Culinary Guild' }}
                </div>
                <h3 class="font-serif text-xl font-bold text-[#133820] dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                  {{ story.title }}
                </h3>
                <p class="text-xs text-[#19231a]/70 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {{ story.excerpt }}
                </p>
              </div>

              <div class="pt-4 border-t border-[#f4ede0] dark:border-[#1f3527] flex items-center justify-between text-xs">
                <span class="font-bold text-[#133820] dark:text-emerald-400 group-hover:underline">
                  Read Full Article →
                </span>
                <span class="text-[10px] text-slate-400">
                  {{ story.category }}
                </span>
              </div>
            </div>

          </article>
        </div>

      </div>

      <!-- =================================================================== -->
      <!-- FULL STORY READING MODAL / SLIDE-OVER -->
      <!-- =================================================================== -->
      <div 
        *ngIf="activeStory()" 
        class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        (click)="closeStory()">
        
        <div 
          (click)="$event.stopPropagation()"
          class="bg-[#faf8f5] dark:bg-[#111d15] w-full max-w-3xl rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] shadow-2xl relative max-h-[90vh] flex flex-col">
          
          <!-- Sticky Modal Header -->
          <div class="sticky top-0 bg-[#faf8f5]/90 dark:bg-[#111d15]/90 backdrop-blur-md px-6 py-4 border-b border-[#e8e4dc] dark:border-[#1f3527] flex items-center justify-between z-10">
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {{ activeStory()?.category }}
            </span>
            <button 
              (click)="closeStory()"
              class="w-8 h-8 rounded-full bg-[#f4ede0] dark:bg-[#17271d] text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform">
              ✕
            </button>
          </div>

          <!-- Scrollable Story Content -->
          <div class="overflow-y-auto p-6 sm:p-10 space-y-6">
            
            <!-- Hero Image -->
            <div class="aspect-video w-full rounded-2xl overflow-hidden shadow-md">
              <img 
                [src]="activeStory()?.cover_image" 
                [alt]="activeStory()?.title"
                class="w-full h-full object-cover">
            </div>

            <!-- Title & Meta -->
            <div class="space-y-2">
              <h2 class="font-serif text-3xl sm:text-4xl font-black text-[#133820] dark:text-[#f3f4f6] leading-tight">
                {{ activeStory()?.title }}
              </h2>
              <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span class="font-bold text-[#133820] dark:text-emerald-400">{{ activeStory()?.author || 'Executive Chef' }}</span>
                <span>•</span>
                <span>{{ activeStory()?.created_at | date:'mediumDate' }}</span>
                <span>•</span>
                <span>{{ activeStory()?.read_time || '4 min read' }}</span>
              </div>
            </div>

            <!-- Excerpt Callout -->
            <blockquote class="p-4 rounded-2xl bg-[#f5f0e6] dark:bg-[#142219] border-l-4 border-emerald-700 dark:border-emerald-400 italic text-sm text-[#19231a] dark:text-slate-200">
              "{{ activeStory()?.excerpt }}"
            </blockquote>

            <!-- Rich Content / Body -->
            <div 
              class="prose prose-emerald dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-4 text-[#19231a]/90 dark:text-slate-200"
              [innerHTML]="activeStory()?.content">
            </div>

            <!-- Bottom CTA -->
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50 dark:bg-emerald-950/60 p-6 rounded-2xl border border-emerald-300/60 dark:border-emerald-700/40">
              <div>
                <h4 class="font-serif font-bold text-[#133820] dark:text-[#f3f4f6] text-base">Taste the Story in Person</h4>
                <p class="text-xs text-[#19231a]/70 dark:text-slate-400">Join our table and experience dishes shaped by this philosophy.</p>
              </div>
              <a 
                routerLink="/reserve" 
                (click)="closeStory()"
                class="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-[#133820] dark:bg-[#22c55e] dark:text-[#0c1510] shadow-md whitespace-nowrap">
                Reserve Table
              </a>
            </div>

          </div>

        </div>
      </div>

    </div>
  `
})
export class StoriesComponent implements OnInit {
  storyService = inject(StoryService);

  readonly categories = computed(() => {
    const list = this.storyService.stories();
    const dynamicCats = Array.from(new Set(list.map((s) => s.category).filter(Boolean)));
    return ['All', ...dynamicCats];
  });
  readonly selectedCategory = signal<string>('All');
  readonly activeStory = signal<Story | null>(null);

  ngOnInit(): void {
    this.storyService.loadPublishedStories().subscribe();
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.storyService.loadPublishedStories(cat).subscribe();
  }

  openStory(story: Story): void {
    this.activeStory.set(story);
  }

  closeStory(): void {
    this.activeStory.set(null);
  }
}
