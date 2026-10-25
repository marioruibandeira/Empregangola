// =====================================================================
//  PaymentsService
//  Fala com o teu backend. O backend é que fala com a Stripe: a chave
//  secreta da Stripe NUNCA pode estar no Angular.
//
//  Precisas de ter  provideHttpClient()  no app.config.ts.
// =====================================================================

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';

export interface CheckoutRequest {
  jobId: number;
  planId: string;     // o backend procura o preço deste plano; nunca recebe o valor do ecrã
}

export interface CheckoutResponse {
  url: string;        // endereço da página de pagamento da Stripe (Checkout)
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);

  /** true = não chama o backend; serve para testar o ecrã. Passa a false quando o backend existir. */
  private readonly useMock = true;

  /**
   * Pede ao backend para criar uma sessão de pagamento (Stripe Checkout).
   * O backend deve usar, no pedido à Stripe:
   *   success_url: https://teu-site/empresa/pagamentos?payment=success&session_id={CHECKOUT_SESSION_ID}
   *   cancel_url:  https://teu-site/empresa/pagamentos?payment=cancelled
   */
  createCheckoutSession(request: CheckoutRequest): Observable<CheckoutResponse> {
    if (this.useMock) {
      return of({ url: '/empresa/pagamentos?payment=success' }).pipe(delay(600));
    }
    return this.http.post<CheckoutResponse>('/api/payments/checkout-session', request);
  }
}
