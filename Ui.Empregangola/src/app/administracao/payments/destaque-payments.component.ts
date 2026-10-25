// =====================================================================
//  PaymentsComponent  (vista da EMPRESA)
//  1. A empresa escolhe uma vaga e a duração do destaque.
//  2. Clica em "Pagar" e é levada para a página segura da Stripe (Checkout).
//  3. Volta a esta página com ?payment=success ou ?payment=cancelled.
//  4. Vê o histórico de pagamentos (em cartões, sem tabela).
//
//  Os dados do cartão nunca passam por esta aplicação: ficam na Stripe.
//
//  IMPORTANTE: voltar com ?payment=success NÃO prova que o pagamento foi
//  feito (qualquer pessoa pode escrever esse endereço). Quem confirma e
//  cria o destaque é o backend, através do webhook da Stripe
//  (evento checkout.session.completed).
//
//  ATENÇÃO: por agora as vagas, os planos e o histórico são EXEMPLOS
//  escritos no código. Quando existir backend, vêm da API.
// =====================================================================

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';
import { PaymentsService } from '../../services/administracao/payments.service';

// ---------------------------------------------------------------------
//  Modelos
// ---------------------------------------------------------------------
export interface PayableJob {
  id: number;
  title: string;
  location: string;
}

export interface FeaturePlan {
  id: string;
  name: string;
  days: number;
  price: number;          // em Kz (só para mostrar; o backend tem o preço oficial)
  recommended: boolean;
}

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type StatusFilter = 'all' | PaymentStatus;

export interface Payment {
  id: string;
  jobTitle: string;
  planName: string;
  amount: number;         // em Kz
  status: PaymentStatus;
  createdAt: string;      // ISO 8601
  receiptUrl: string | null;
}

export interface Banner {
  kind: 'success' | 'cancelled' | 'error';
  text: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    DatePipe,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './destaque-payments.component.html',
  styleUrl: './destaque-payments.component.css',
})
export class PaymentsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentsService = inject(PaymentsService);

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  jobs = signal<PayableJob[]>(this.sampleJobs());
  plans = signal<FeaturePlan[]>(this.samplePlans());
  payments = signal<Payment[]>(this.samplePayments());

  selectedJobId = signal<number | null>(null);
  selectedPlanId = signal<string | null>('feature-15');
  statusFilter = signal<StatusFilter>('all');

  isPaying = signal(false);
  errorMessage = signal<string | null>(null);
  banner = signal<Banner | null>(null);

  readonly filters: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'paid', label: 'Pagos' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'failed', label: 'Falhados' },
    { value: 'refunded', label: 'Reembolsados' }
  ];

  selectedJob = computed(() => this.jobs().find(j => j.id === this.selectedJobId()) ?? null);
  selectedPlan = computed(() => this.plans().find(p => p.id === this.selectedPlanId()) ?? null);
  canPay = computed(() => !!this.selectedJob() && !!this.selectedPlan() && !this.isPaying());

  /** Soma dos pagamentos já confirmados. */
  totalPaid = computed(() =>
    this.payments().filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0));

  counts = computed(() => {
    const result: Record<StatusFilter, number> = {
      all: this.payments().length, paid: 0, pending: 0, failed: 0, refunded: 0
    };
    for (const p of this.payments()) {
      result[p.status]++;
    }
    return result;
  });

  filteredPayments = computed(() => {
    const filter = this.statusFilter();
    return this.payments()
      .filter(p => filter === 'all' || p.status === filter)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  });

  // ===================================================================
  //  2. ACÇÕES
  // ===================================================================

  /** Lê o resultado que a Stripe devolve no endereço e mostra o aviso certo. */
  ngOnInit(): void {
    const result = this.route.snapshot.queryParamMap.get('payment');

    if (result === 'success') {
      this.banner.set({
        kind: 'success',
        text: 'Recebemos o seu pedido de pagamento. A vaga fica em destaque assim que o pagamento for confirmado, o que costuma demorar poucos instantes.'
      });
    } else if (result === 'cancelled') {
      this.banner.set({
        kind: 'cancelled',
        text: 'O pagamento foi cancelado e não foi cobrado nenhum valor.'
      });
    }

    if (result) {
      // Limpa o endereço para o aviso não voltar a aparecer ao recarregar a página.
      this.router.navigate([], { queryParams: {}, replaceUrl: true });
    }
  }

  onJobChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedJobId.set(value ? Number(value) : null);
  }

  /** Pede ao backend uma sessão de pagamento e leva a empresa para a Stripe. */
  pay(): void {
    const job = this.selectedJob();
    const plan = this.selectedPlan();
    if (!job || !plan || this.isPaying()) {
      return;
    }

    this.isPaying.set(true);
    this.errorMessage.set(null);

    this.paymentsService.createCheckoutSession({ jobId: job.id, planId: plan.id }).subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: () => {
        this.isPaying.set(false);
        this.errorMessage.set('Não foi possível iniciar o pagamento. Tente novamente dentro de instantes.');
      }
    });
  }

  dismissBanner(): void {
    this.banner.set(null);
  }

  // ===================================================================
  //  3. TEXTOS USADOS NO TEMPLATE
  // ===================================================================

  statusText(status: PaymentStatus): string {
    return { paid: 'Pago', pending: 'Pendente', failed: 'Falhou', refunded: 'Reembolsado' }[status];
  }

  /** "1.500 Kz por dia" */
  pricePerDay(plan: FeaturePlan): string {
    return `${this.formatKz(Math.round(plan.price / plan.days))} Kz por dia`;
  }

  /** 80000 -> "80.000" */
  formatKz(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // ===================================================================
  //  4. DADOS DE EXEMPLO
  // ===================================================================

  private daysAgo(n: number): string {
    return new Date(Date.now() - n * DAY_MS).toISOString();
  }

  private sampleJobs(): PayableJob[] {
    return [
      { id: 5, title: 'Supervisor(a) de Loja', location: 'Cazenga, Luanda' },
      { id: 6, title: 'Contabilista Sénior', location: 'Maianga, Luanda' },
      { id: 7, title: 'Técnico de Redes', location: 'Talatona, Luanda' }
    ];
  }

  private samplePlans(): FeaturePlan[] {
    return [
      { id: 'feature-7', name: '7 dias', days: 7, price: 25000, recommended: false },
      { id: 'feature-15', name: '15 dias', days: 15, price: 45000, recommended: true },
      { id: 'feature-30', name: '30 dias', days: 30, price: 80000, recommended: false }
    ];
  }

  private samplePayments(): Payment[] {
    return [
      {
        id: 'pay_1', jobTitle: 'Engenheiro de Software .NET e Angular', planName: '15 dias',
        amount: 45000, status: 'paid', createdAt: this.daysAgo(6), receiptUrl: '#'
      },
      {
        id: 'pay_2', jobTitle: 'Gestor de Operações Logísticas', planName: '15 dias',
        amount: 45000, status: 'paid', createdAt: this.daysAgo(12), receiptUrl: '#'
      },
      {
        id: 'pay_3', jobTitle: 'Analista Financeiro Júnior', planName: '7 dias',
        amount: 25000, status: 'pending', createdAt: this.daysAgo(0), receiptUrl: null
      },
      {
        id: 'pay_4', jobTitle: 'Designer de Produto Digital', planName: '30 dias',
        amount: 80000, status: 'refunded', createdAt: this.daysAgo(21), receiptUrl: '#'
      },
      {
        id: 'pay_5', jobTitle: 'Supervisor(a) de Loja', planName: '7 dias',
        amount: 25000, status: 'failed', createdAt: this.daysAgo(2), receiptUrl: null
      }
    ];
  }
}
