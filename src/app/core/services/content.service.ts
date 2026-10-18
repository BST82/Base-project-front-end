import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SiteContentMap } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/content';

  // Reactive state strictly managed through API response
  readonly contents = signal<SiteContentMap>({});

  readonly isLoaded = signal<boolean>(false);

  constructor() {
    this.loadContent().subscribe({
      next: () => {},
      error: (e) => console.warn('ContentService: Could not load initial content', e)
    });
  }

  // Helper computed selector
  get(key: string, fallback: string = ''): string {
    return this.contents()[key] ?? fallback;
  }

  loadContent(): Observable<SiteContentMap> {
    return this.http.get<SiteContentMap>(this.apiUrl).pipe(
      tap((data) => {
        this.contents.set(data || {});
        this.isLoaded.set(true);
      })
    );
  }

  updateBulk(contents: SiteContentMap): Observable<SiteContentMap> {
    return this.http.put<SiteContentMap>(`${this.apiUrl}/bulk`, { contents }).pipe(
      tap((updated) => {
        this.contents.update((current) => ({ ...current, ...updated }));
      })
    );
  }

  uploadAsset(file: File): Observable<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string; filename: string }>(`${this.apiUrl}/upload-asset`, formData);
  }
}
