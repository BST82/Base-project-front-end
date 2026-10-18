import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Review } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/reviews';

  readonly reviews = signal<Review[]>([]);
  readonly loading = signal<boolean>(false);

  loadApprovedReviews(): Observable<Review[]> {
    this.loading.set(true);
    return this.http.get<Review[]>(this.apiUrl).pipe(
      tap({
        next: (list) => {
          this.reviews.set(list);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      })
    );
  }

  submitReview(data: { customer_name: string; rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, data);
  }

  loadAllReviewsAdmin(isApproved?: boolean): Observable<Review[]> {
    let params = new HttpParams();
    if (isApproved !== undefined) {
      params = params.set('is_approved', isApproved.toString());
    }
    return this.http.get<Review[]>(`${this.apiUrl}/all`, { params });
  }

  moderateReview(id: number, isApproved: boolean): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${id}/moderate`, { is_approved: isApproved });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
