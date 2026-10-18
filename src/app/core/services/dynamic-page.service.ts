import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DynamicPage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DynamicPageService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/pages';

  readonly pages = signal<DynamicPage[]>([]);
  readonly activePage = signal<DynamicPage | null>(null);
  readonly loading = signal<boolean>(false);

  loadAllPages(): Observable<DynamicPage[]> {
    this.loading.set(true);
    return this.http.get<DynamicPage[]>(this.apiUrl).pipe(
      tap({
        next: (items) => {
          this.pages.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  getPageBySlug(slug: string): Observable<DynamicPage> {
    this.loading.set(true);
    return this.http.get<DynamicPage>(`${this.apiUrl}/${slug}`).pipe(
      tap({
        next: (page) => {
          this.activePage.set(page);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  createPage(page: Partial<DynamicPage>): Observable<DynamicPage> {
    return this.http.post<DynamicPage>(this.apiUrl, page).pipe(
      tap((created) => {
        this.pages.update((list) => [created, ...list]);
      })
    );
  }

  updatePage(id: number, page: Partial<DynamicPage>): Observable<DynamicPage> {
    return this.http.put<DynamicPage>(`${this.apiUrl}/${id}`, page).pipe(
      tap((updated) => {
        this.pages.update((list) => list.map((p) => (p.id === id ? updated : p)));
        if (this.activePage()?.id === id) {
          this.activePage.set(updated);
        }
      })
    );
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.pages.update((list) => list.filter((p) => p.id !== id));
      })
    );
  }

  uploadAsset(file: File): Observable<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; filename: string }>(`${this.apiUrl}/upload-asset`, formData);
  }
}
