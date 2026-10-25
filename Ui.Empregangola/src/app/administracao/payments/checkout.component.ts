// =====================================================================
//  CheckoutComponent  (página onde se paga)
//  Recolhe os dados do titular (nome, email, morada) e os dados do cartão.
//
//  SEGURANÇA: o número, a validade e o código do cartão NÃO são campos
//  nossos. São campos da Stripe (Stripe Elements) desenhados dentro desta
//  página: os dados vão directo do browser para a Stripe e nunca passam
//  pelo Angular nem pelo backend. Não os guardes nem os registes em logs.
//
//  Instalar:   npm install @stripe/stripe-js
//
//  Fluxo:
//   1. Chega aqui de /empresa/pagamentos?jobId=..&planId=.. (query params).
//   2. O backend cria um PaymentIntent e devolve o clientSecret + resumo.
//   3. A empresa preenche tudo e clica em "Pagar".
//   4. stripe.confirmCardPayment() cobra o cartão (e trata do 3D Secure).
//   5. Volta a /empresa/pagamentos?payment=success.
//
//  Quem confirma o pagamento e cria o destaque é o BACKEND, pelo webhook
//  payment_intent.succeeded. O regresso a esta página não prova nada.
// =====================================================================

import {
  AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import {
//   loadStripe, Stripe, StripeCardCvcElement, StripeCardExpiryElement,
//   StripeCardNumberElement, StripeElementStyle
// } from '@stripe/stripe-js';

import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';
// import { PaymentIntentResponse, PaymentsService } from '../payments.service';

/**
 * Chave PÚBLICA da Stripe (começa por pk_). Esta pode estar no Angular.
 * Nunca ponhas aqui a chave secreta (sk_). Em produção, move-a para o environment.
 */
const STRIPE_PUBLISHABLE_KEY = 'pk_test_COLOQUE_AQUI_A_SUA_CHAVE_PUBLICA';

type CardField = 'number' | 'expiry' | 'cvc';

// const CARD_STYLE: StripeElementStyle = {
//   base: {
//     fontSize: '16px',
//     color: '#16283a',
//     fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
//     '::placeholder': { color: '#6b7a89' }
//   },
//   invalid: { color: '#b42318' }
// };

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit /* , AfterViewInit, OnDestroy */ {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  // private readonly paymentsService = inject(PaymentsService);

  @ViewChild('cardNumberHost', { static: true }) cardNumberHost!: ElementRef<HTMLDivElement>;
  @ViewChild('cardExpiryHost', { static: true }) cardExpiryHost!: ElementRef<HTMLDivElement>;
  @ViewChild('cardCvcHost', { static: true }) cardCvcHost!: ElementRef<HTMLDivElement>;

  // private stripe: Stripe | null = null;
  // private cardNumber: StripeCardNumberElement | null = null;
  // private cardExpiry: StripeCardExpiryElement | null = null;
  // private cardCvc: StripeCardCvcElement | null = null;

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  /** Rotas (ajusta às tuas). */
  readonly paymentsRoute = '/empresa/pagamentos';

  readonly countries = [
    { code: 'AO', name: 'Angola' },
    { code: 'PT', name: 'Portugal' },
    { code: 'BR', name: 'Brasil' },
    { code: 'MZ', name: 'Moçambique' },
    { code: 'CV', name: 'Cabo Verde' },
    { code: 'US', name: 'Estados Unidos' }
  ];

  form = this.fb.group({
    holderName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    country: ['AO', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required]
  });

  // summary = signal<PaymentIntentResponse | null>(null);
  loadError = signal<string | null>(null);

  submitted = signal(false);
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);

  focused = signal<CardField | null>(null);
  complete = signal<Record<CardField, boolean>>({ number: false, expiry: false, cvc: false });
  cardErrors = signal<Record<CardField, string | null>>({ number: null, expiry: null, cvc: null });

  /** Primeiro erro devolvido pela Stripe (cartão inválido, expirado, etc.). */
  cardError = computed(() => {
    const e = this.cardErrors();
    return e.number ?? e.expiry ?? e.cvc;
  });

  // ===================================================================
  //  2. CICLO DE VIDA
  // ===================================================================

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const jobId = Number(params.get('jobId'));
    const planId = params.get('planId');

    if (!jobId || !planId) {
      this.loadError.set('Escolha primeiro a vaga e a duração do destaque.');
      return;
    }

    
  }

  // async ngAfterViewInit(): Promise<void> {
  //   this.stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY, { locale: 'pt' });
  //   if (!this.stripe) {
  //     this.errorMessage.set('Não foi possível carregar o sistema de pagamento. Recarregue a página.');
  //     return;
  //   }

  //   const elements = this.stripe.elements();

  //   this.cardNumber = elements.create('cardNumber', { style: CARD_STYLE, showIcon: true });
  //   this.cardExpiry = elements.create('cardExpiry', { style: CARD_STYLE });
  //   this.cardCvc = elements.create('cardCvc', { style: CARD_STYLE });

  //   this.cardNumber.mount(this.cardNumberHost.nativeElement);
  //   this.cardExpiry.mount(this.cardExpiryHost.nativeElement);
  //   this.cardCvc.mount(this.cardCvcHost.nativeElement);

    

  //   this.cardNumber.on('focus', () => this.focused.set('number'));
  //   this.cardExpiry.on('focus', () => this.focused.set('expiry'));
  //   this.cardCvc.on('focus', () => this.focused.set('cvc'));
  //   this.cardNumber.on('blur', () => this.focused.set(null));
  //   this.cardExpiry.on('blur', () => this.focused.set(null));
  //   this.cardCvc.on('blur', () => this.focused.set(null));
  // }

  ngOnDestroy(): void {
    // this.cardNumber?.destroy();
    // this.cardExpiry?.destroy();
    // this.cardCvc?.destroy();
  }

  // ===================================================================
  //  3. ACÇÕES
  // ===================================================================

  private onCardChange(field: CardField, complete: boolean, error: string | null): void {
    this.complete.update(c => ({ ...c, [field]: complete }));
    this.cardErrors.update(e => ({ ...e, [field]: error }));
  }

  async pay(): Promise<void> {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    this.errorMessage.set(null);

    // const secret = this.summary()?.clientSecret;
    // if (!this.stripe || !this.cardNumber || !secret || this.isProcessing()) {
    //   return;
    // }
    if (this.form.invalid) {
      return;
    }

    const filled = this.complete();
    if (!filled.number || !filled.expiry || !filled.cvc) {
      this.errorMessage.set('Preencha o número, a validade e o código de segurança do cartão.');
      return;
    }

    const v = this.form.getRawValue();
    this.isProcessing.set(true);

    // A Stripe lê os campos do cartão directamente; nós só enviamos os dados do titular.
    // const result = await this.stripe.confirmCardPayment(secret, {
    //   payment_method: {
    //     card: this.cardNumber,
    //     billing_details: {
    //       name: v.holderName.trim(),
    //       email: v.email.trim(),
    //       address: { line1: v.address.trim(), city: v.city.trim(), country: v.country }
    //     }
    //   },
    //   receipt_email: v.email.trim()
    // });

    // if (result.error) {
    //   this.errorMessage.set(result.error.message ?? 'O pagamento não foi aceite. Verifique os dados e tente novamente.');
    //   this.isProcessing.set(false);
    //   return;
    // }

    // const status = result.paymentIntent.status;
    // if (status === 'succeeded' || status === 'processing') {
    //   this.router.navigate([this.paymentsRoute], { queryParams: { payment: 'success' } });
    //   return;
    // }

    this.errorMessage.set('O pagamento não foi concluído. Tente novamente.');
    this.isProcessing.set(false);
  }

  // ===================================================================
  //  4. TEXTOS USADOS NO TEMPLATE
  // ===================================================================

  /** Mensagem de erro de um campo (só depois de tocado ou de tentar pagar). */
  fieldError(control: AbstractControl, label: string): string | null {
    if (!control.invalid || !(control.touched || this.submitted())) {
      return null;
    }
    if (control.hasError('required')) {
      return `Indique ${label}.`;
    }
    if (control.hasError('email')) {
      return 'Indique um email válido.';
    }
    if (control.hasError('minlength')) {
      return 'O nome parece demasiado curto.';
    }
    return 'Valor inválido.';
  }

  /** 80000 -> "80.000" */
  formatKz(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
