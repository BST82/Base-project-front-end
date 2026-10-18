import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NavItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/navigation';

  readonly navItems = signal<NavItem[]>([]);

  constructor() {
    this.loadNavItems().subscribe();
  }

  loadNavItems(): Observable<NavItem[]> {
    return this.http.get<NavItem[]>(this.apiUrl).pipe(
      tap((items) => {
        this.navItems.set(items || []);
      })
    );
  }


  loadAllAdmin(): Observable<NavItem[]> {
    return this.http.get<NavItem[]>(`${this.apiUrl}/admin/all`);
  }

  createNavItem(item: Partial<NavItem> & { create_page?: boolean; page_title?: string; page_subtitle?: string; page_hero_image?: string }): Observable<NavItem> {
    return this.http.post<NavItem>(this.apiUrl, item).pipe(
      tap((created) => {
        this.navItems.update((list) => [...list, created].sort((a, b) => a.display_order - b.display_order));
      })
    );
  }

  updateNavItem(id: number, item: Partial<NavItem>): Observable<NavItem> {
    return this.http.put<NavItem>(`${this.apiUrl}/${id}`, item).pipe(
      tap((updated) => {
        this.navItems.update((list) =>
          list.map((i) => (i.id === id ? updated : i)).sort((a, b) => a.display_order - b.display_order)
        );
      })
    );
  }

  deleteNavItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.navItems.update((list) => list.filter((i) => i.id !== id));
      })
    );
  }
}
