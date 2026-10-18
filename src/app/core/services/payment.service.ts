import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentOrderResponse, PaymentVerificationResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/payments';

  createOrder(
    payloadOrId: number | { reservation_id: number; gateway?: string; method?: string },
    gateway: string = 'razorpay',
    method: string = 'UPI'
  ): Observable<PaymentOrderResponse> {
    const payload = typeof payloadOrId === 'number'
      ? { reservation_id: payloadOrId, gateway, method }
      : {
          reservation_id: payloadOrId.reservation_id,
          gateway: payloadOrId.gateway || 'razorpay',
          method: payloadOrId.method || 'UPI'
        };
    return this.http.post<PaymentOrderResponse>(`${this.apiUrl}/create-order`, payload);
  }

  verifyPayment(payload: {
    order_id: string;
    payment_id: string;
    signature?: string;
    gateway?: string;
  }): Observable<PaymentVerificationResponse> {
    return this.http.post<PaymentVerificationResponse>(`${this.apiUrl}/verify`, payload);
  }
}
