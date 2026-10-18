import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category, MenuItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/menu';

  readonly categories = signal<Category[]>([]);
  readonly items = signal<MenuItem[]>([]);
  readonly loading = signal<boolean>(false);

  readonly topRecipes = computed(() => this.items().filter((i) => i.is_top_recipe));
  readonly chefSpecials = computed(() => this.items().filter((i) => i.is_chef_special));

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      tap((cats) => this.categories.set(cats))
    );
  }

  loadItems(filters?: { category_id?: number; search?: string; in_stock_only?: boolean }): Observable<MenuItem[]> {
    this.loading.set(true);
    let params = new HttpParams();
    if (filters?.category_id) {
      params = params.set('category_id', filters.category_id.toString());
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.in_stock_only) {
      params = params.set('in_stock_only', 'true');
    }

    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`, { params }).pipe(
      tap({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  createItem(item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/items`, item).pipe(
      tap((newItem) => this.items.update((list) => [newItem, ...list]))
    );
  }

  updateItem(id: number, item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}`, item).pipe(
      tap((updated) => {
        this.items.update((list) => list.map((i) => (i.id === id ? updated : i)));
      })
    );
  }

  toggleStock(id: number): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/items/${id}/toggle-stock`, {}).pipe(
      tap((updated) => {
        this.items.update((list) => list.map((i) => (i.id === id ? updated : i)));
      })
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`).pipe(
      tap(() => {
        this.items.update((list) => list.filter((i) => i.id !== id));
      })
    );
  }

  createCategory(cat: { name: string; slug: string; display_order?: number }): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, cat).pipe(
      tap((newCat) => this.categories.update((list) => [...list, newCat]))
    );
  }
}
