import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BannerSlide } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BannerSlideService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/banner-slides';

  readonly slides = signal<BannerSlide[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    this.loadActiveSlides().subscribe();
  }

  loadActiveSlides(): Observable<BannerSlide[]> {
    this.loading.set(true);
    return this.http.get<BannerSlide[]>(this.apiUrl).pipe(
      tap({
        next: (items) => {
          this.slides.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  loadSlides(): Observable<BannerSlide[]> {
    return this.loadActiveSlides();
  }


  loadAllAdmin(): Observable<BannerSlide[]> {
    return this.http.get<BannerSlide[]>(`${this.apiUrl}/admin/all`);
  }

  createSlide(slide: Partial<BannerSlide>): Observable<BannerSlide> {
    return this.http.post<BannerSlide>(this.apiUrl, slide).pipe(
      tap((created) => {
        this.slides.update((list) => [...list, created].sort((a, b) => a.display_order - b.display_order));
      })
    );
  }

  updateSlide(id: number, slide: Partial<BannerSlide>): Observable<BannerSlide> {
    return this.http.put<BannerSlide>(`${this.apiUrl}/${id}`, slide).pipe(
      tap((updated) => {
        this.slides.update((list) =>
          list.map((s) => (s.id === id ? updated : s)).sort((a, b) => a.display_order - b.display_order)
        );
      })
    );
  }

  deleteSlide(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.slides.update((list) => list.filter((s) => s.id !== id));
      })
    );
  }
}
