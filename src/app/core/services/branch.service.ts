import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Branch } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/branches';

  readonly branches = signal<Branch[]>([]);
  readonly cities = signal<string[]>([]);
  readonly selectedCity = signal<string>('All');
  readonly loading = signal<boolean>(false);

  loadBranches(city?: string): Observable<Branch[]> {
    this.loading.set(true);
    let params = new HttpParams();
    if (city && city !== 'All') {
      params = params.set('city', city);
    }

    return this.http.get<Branch[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (list) => {
          this.branches.set(list);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  loadCities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cities`).pipe(
      tap((cList) => this.cities.set(cList))
    );
  }

  loadAllAdmin(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/admin/all`);
  }

  createBranch(branch: Partial<Branch>): Observable<Branch> {
    return this.http.post<Branch>(this.apiUrl, branch).pipe(
      tap((created) => {
        this.branches.update((list) => [...list, created]);
        this.loadCities().subscribe();
      })
    );
  }

  updateBranch(id: number, branch: Partial<Branch>): Observable<Branch> {
    return this.http.put<Branch>(`${this.apiUrl}/${id}`, branch).pipe(
      tap((updated) => {
        this.branches.update((list) => list.map((b) => (b.id === id ? updated : b)));
        this.loadCities().subscribe();
      })
    );
  }

  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.branches.update((list) => list.filter((b) => b.id !== id));
        this.loadCities().subscribe();
      })
    );
  }
}
