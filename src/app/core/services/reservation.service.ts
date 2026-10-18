import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableSlot, ReservationHoldResponse, Reservation, Table } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/reservations';

  readonly selectedDate = signal<string>(new Date().toISOString().split('T')[0]);
  readonly selectedGuests = signal<number>(2);
  readonly availableSlots = signal<AvailableSlot[]>([]);
  readonly loading = signal<boolean>(false);

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(`${this.apiUrl}/tables`);
  }

  getAvailableSlots(date: string, guests: number): Observable<AvailableSlot[]> {
    this.loading.set(true);
    const params = new HttpParams().set('date', date).set('guests', guests.toString());
    return this.http.get<AvailableSlot[]>(`${this.apiUrl}/available-slots`, { params });
  }

  holdSlot(tableId: number, date: string, slotStart: string, sessionId: string): Observable<ReservationHoldResponse> {
    return this.http.post<ReservationHoldResponse>(`${this.apiUrl}/hold-slot`, {
      table_id: tableId,
      date,
      slot_start: slotStart,
      session_id: sessionId
    });
  }

  bookReservation(bookingData: {
    table_id: number;
    reservation_date: string;
    slot_start: string;
    slot_end: string;
    guests: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    special_requests?: string;
    session_id: string;
  }): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/book`, bookingData);
  }

  getAllReservations(dateVal?: string, statusVal?: string): Observable<Reservation[]> {
    let params = new HttpParams();
    if (dateVal) params = params.set('date_val', dateVal);
    if (statusVal) params = params.set('status_val', statusVal);
    return this.http.get<Reservation[]>(`${this.apiUrl}/all`, { params });
  }

  updateReservationStatus(id: number, status: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/status`, { status });
  }

  rescheduleReservation(id: number, data: { reservation_date: string; slot_start: string; slot_end: string; table_id?: number }): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/reschedule`, data);
  }
}

