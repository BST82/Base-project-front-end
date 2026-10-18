import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BranchService } from '../core/services/branch.service';
import { ContentService } from '../core/services/content.service';
import { Branch } from '../core/models';

declare const L: any;

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-[#f3f4f6] transition-colors duration-200">
      
      <!-- HERO HEADER -->
      <section class="border-b border-[#e8e4dc] dark:border-[#1f3527] bg-[#f5f0e6] dark:bg-[#111d15] py-14 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center space-y-3">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#133820] dark:bg-[#22c55e] text-[#faf8f5] dark:text-[#0c1510] text-xs font-bold uppercase tracking-wider shadow-sm">
            <span>📍 Multi-Branch Dining</span>
          </div>
          <h1 class="font-serif text-4xl sm:text-5xl font-black text-[#133820] dark:text-[#f3f4f6] tracking-tight">
            Find Your Local Kitchen
          </h1>
          <p class="max-w-2xl mx-auto text-sm sm:text-base text-[#19231a]/70 dark:text-slate-300">
            Visit any of our sustainable scratch locations. Pick a city below to view coordinates, daily service hours, and reserve your table.
          </p>
        </div>
      </section>

      <!-- MAIN CONTENT: FILTER + MAP + BRANCH CARDS -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <!-- CITY SELECTOR PILLS & SEARCH BAR -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#142219] p-4 rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] shadow-sm">
          
          <!-- City Pills -->
          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span class="text-xs uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 mr-1 hidden sm:inline">
              Cities:
            </span>
            <button 
              (click)="onSelectCity('All')"
              [class]="selectedCity() === 'All' ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-slate-300 hover:bg-[#ede8df] dark:hover:bg-[#1f3527]'"
              class="px-4 py-2 rounded-full text-xs transition-all">
              All Cities ({{ branchService.branches().length }})
            </button>
            <button 
              *ngFor="let city of branchService.cities()"
              (click)="onSelectCity(city)"
              [class]="selectedCity() === city ? 'bg-[#133820] text-white dark:bg-[#22c55e] dark:text-[#0c1510] font-bold shadow-sm' : 'bg-[#faf8f5] dark:bg-[#0c1510] text-[#19231a] dark:text-slate-300 hover:bg-[#ede8df] dark:hover:bg-[#1f3527]'"
              class="px-4 py-2 rounded-full text-xs transition-all">
              {{ city }}
            </button>
          </div>

          <!-- Keyword Search -->
          <div class="w-full md:w-72">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">🔍</span>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search branch, street, zip..." 
                class="w-full pl-9 pr-4 py-2 bg-[#faf8f5] dark:bg-[#0c1510] border border-[#e2ded6] dark:border-[#1f3527] rounded-full text-xs text-[#19231a] dark:text-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-emerald-600">
            </div>
          </div>
        </div>

        <!-- SPLIT VIEW: INTERACTIVE MAP & BRANCH CARDS -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT / TOP: LEAFLET MAP CONTAINER -->
          <div class="lg:col-span-7 rounded-3xl overflow-hidden border border-[#e8e4dc] dark:border-[#1f3527] shadow-lg bg-[#f0ede6] dark:bg-[#0c1510] sticky top-24">
            <div class="p-3 bg-[#133820] dark:bg-[#111d15] text-[#faf8f5] flex items-center justify-between text-xs px-5 border-b border-emerald-900/50">
              <span class="font-bold tracking-wide flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Interactive Branch Map
              </span>
              <span class="text-emerald-200 text-[11px]">Click pin to view details & book</span>
            </div>
            
            <!-- Map Target Div -->
            <div id="branch-map" class="w-full h-[420px] sm:h-[500px] z-10"></div>
          </div>

          <!-- RIGHT / BOTTOM: BRANCH LIST CARDS -->
          <div class="lg:col-span-5 space-y-4">
            <div class="flex items-center justify-between px-2">
              <h3 class="font-serif text-lg font-bold text-[#133820] dark:text-[#f3f4f6]">
                Locations in {{ selectedCity() }} ({{ filteredBranches().length }})
              </h3>
              <span class="text-xs text-slate-500">Sorted by proximity</span>
            </div>

            <div *ngIf="filteredBranches().length === 0" class="p-8 text-center bg-white dark:bg-[#142219] rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] text-slate-500 text-sm">
              No branches found matching your search. Try another city or search keyword.
            </div>

            <!-- Branch Card -->
            <div 
              *ngFor="let b of filteredBranches()"
              (click)="focusBranch(b)"
              [class.ring-2]="activeBranchId() === b.id"
              [class.ring-emerald-600]="activeBranchId() === b.id"
              class="p-6 bg-white dark:bg-[#142219] rounded-3xl border border-[#e8e4dc] dark:border-[#1f3527] hover:border-emerald-600/60 dark:hover:border-emerald-400/60 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4">
              
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-serif text-lg font-bold text-[#133820] dark:text-slate-100">{{ b.name }}</h4>
                    <span *ngIf="b.is_active" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Open Now
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-start gap-1.5">
                    <span>📍</span>
                    <span>{{ b.address }}, {{ b.city }}</span>
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#19231a]/80 dark:text-slate-300 bg-[#faf8f5] dark:bg-[#0c1510] p-3 rounded-2xl">
                <div>
                  <span class="font-bold text-[#133820] dark:text-emerald-400 block">🕒 Hours:</span>
                  <span>{{ b.opening_hours || b.operating_hours || '11:00 AM – 10:00 PM' }}</span>
                </div>
                <div>
                  <span class="font-bold text-[#133820] dark:text-emerald-400 block">📞 Phone:</span>
                  <span>{{ b.phone || '+1 (555) 789-2341' }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-3 pt-2">
                <a 
                  [href]="'https://www.google.com/maps/search/?api=1&query=' + b.latitude + ',' + b.longitude" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  (click)="$event.stopPropagation()"
                  class="flex-1 py-2 px-3 text-center rounded-full text-xs font-bold border border-[#e2ded6] dark:border-[#1f3527] hover:bg-[#faf8f5] dark:hover:bg-[#0c1510] transition-colors">
                  🧭 Directions
                </a>
                <a 
                  routerLink="/reserve"
                  (click)="$event.stopPropagation()"
                  class="flex-1 py-2 px-3 text-center rounded-full text-xs font-bold text-white bg-[#133820] hover:bg-[#1b4d2c] dark:bg-[#22c55e] dark:hover:bg-[#16a34a] dark:text-[#0c1510] shadow-sm transition-all">
                  Reserve Table
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class LocationsComponent implements OnInit, AfterViewInit, OnDestroy {
  branchService = inject(BranchService);
  contentService = inject(ContentService);

  readonly selectedCity = signal<string>('All');
  readonly activeBranchId = signal<number | null>(null);
  searchQuery = '';

  private map: any = null;
  private markersMap = new Map<number, any>();

  ngOnInit(): void {
    this.branchService.loadBranches().subscribe({
      next: (branches) => {
        if (branches.length > 0) {
          this.updateMapMarkers();
        }
      }
    });
    this.branchService.loadCities().subscribe();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
    }
  }

  private initMap(): void {
    if (typeof L === 'undefined') {
      setTimeout(() => this.initMap(), 300);
      return;
    }

    const mapEl = document.getElementById('branch-map');
    if (!mapEl || this.map) return;

    // Center on US average or first branch
    this.map = L.map('branch-map', {
      scrollWheelZoom: false,
      zoomControl: true
    }).setView([37.7749, -122.4194], 5);

    // OpenStreetMap modern tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.updateMapMarkers();
  }

  filteredBranches(): Branch[] {
    let list = this.branchService.branches();
    if (this.selectedCity() !== 'All') {
      list = list.filter((b) => b.city.toLowerCase() === this.selectedCity().toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q)
      );
    }
    return list;
  }

  onSelectCity(city: string): void {
    this.selectedCity.set(city);
    this.branchService.loadBranches(city).subscribe({
      next: () => {
        this.updateMapMarkers();
      }
    });
  }

  focusBranch(b: Branch): void {
    this.activeBranchId.set(b.id);
    if (this.map && b.latitude && b.longitude) {
      this.map.flyTo([b.latitude, b.longitude], 14, { duration: 1.2 });
      const marker = this.markersMap.get(b.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }

  private updateMapMarkers(): void {
    if (!this.map || typeof L === 'undefined') return;

    // Remove existing markers
    this.markersMap.forEach((m) => this.map.removeLayer(m));
    this.markersMap.clear();

    const branches = this.filteredBranches();
    if (branches.length === 0) return;

    const bounds = L.latLngBounds([]);

    branches.forEach((branch) => {
      if (branch.latitude && branch.longitude) {
        const marker = L.marker([branch.latitude, branch.longitude]).addTo(this.map);
        
        const popupHtml = `
          <div style="font-family: inherit; padding: 4px; max-width: 230px;">
            <div style="font-size: 13px; font-weight: bold; color: #133820; margin-bottom: 2px;">
              ${branch.name}
            </div>
            <div style="font-size: 11px; color: #555; margin-bottom: 4px;">
              📍 ${branch.address}, ${branch.city}
            </div>
            <div style="font-size: 11px; color: #133820; font-weight: 600; margin-bottom: 8px;">
              🕒 ${branch.opening_hours || branch.operating_hours || '11:00 AM – 10:00 PM'}
            </div>
            <a href="/reserve" style="display: block; text-align: center; background: #133820; color: #fff; padding: 6px 12px; border-radius: 9999px; text-decoration: none; font-size: 11px; font-weight: bold;">
              Reserve Table Here
            </a>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          this.activeBranchId.set(branch.id);
        });

        this.markersMap.set(branch.id, marker);
        bounds.extend([branch.latitude, branch.longitude]);
      }
    });

    if (branches.length > 0 && bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }
}
