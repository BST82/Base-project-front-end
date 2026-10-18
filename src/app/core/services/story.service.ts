import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Story } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/stories';

  readonly stories = signal<Story[]>([]);
  readonly loading = signal<boolean>(false);

  loadPublishedStories(category?: string): Observable<Story[]> {
    this.loading.set(true);
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }

    return this.http.get<Story[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (items) => {
          this.stories.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  loadSingleStory(slugOrId: string): Observable<Story> {
    return this.http.get<Story>(`${this.apiUrl}/${slugOrId}`);
  }

  loadAllAdmin(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.apiUrl}/admin/all`);
  }

  createStory(story: Partial<Story>): Observable<Story> {
    return this.http.post<Story>(this.apiUrl, story).pipe(
      tap((created) => {
        this.stories.update((list) => [created, ...list]);
      })
    );
  }

  updateStory(id: number, story: Partial<Story>): Observable<Story> {
    return this.http.put<Story>(`${this.apiUrl}/${id}`, story).pipe(
      tap((updated) => {
        this.stories.update((list) => list.map((s) => (s.id === id ? updated : s)));
      })
    );
  }

  deleteStory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.stories.update((list) => list.filter((s) => s.id !== id));
      })
    );
  }
}
