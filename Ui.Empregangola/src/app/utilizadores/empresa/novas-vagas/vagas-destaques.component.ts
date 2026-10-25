// =====================================================================
//  VagasDestaquesComponent  (vista da EMPRESA)
//  Mostra as vagas que a empresa destacou, quanto tempo falta para o
//  destaque terminar e os resultados de cada uma (visualizações e
//  candidaturas). Permite ver candidatos, editar, renovar e remover
//  o destaque. Não usa tabelas: tudo em cartões.
//
//  ATENÇÃO: por agora as vagas são um EXEMPLO escrito no código. Quando
//  existir backend, o signal `vagas` passa a ser preenchido pela API
//  (só as vagas da empresa com sessão iniciada) e as acções
//  `renovar` e `confirmarRemocao` devem chamar a API.
// =====================================================================

import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

// ---------------------------------------------------------------------
//  Modelo
// ---------------------------------------------------------------------
export interface VagaDestacada {
  id: number;
  titulo: string;
  area: string;
  provincia: string;
  municipio: string;
  modalidade: 'Presencial' | 'Híbrido' | 'Remoto';
  contrato: string;
  salarioMin: number | null;
  salarioMax: number | null;
  pausada: boolean;
  destaqueInicio: string;       // ISO 8601
  destaqueFim: string;          // ISO 8601
  visualizacoes: number;
  candidaturas: number;
  novasCandidaturas: number;    // ainda não vistas pela empresa
}

/** Situação do destaque, calculada a partir das datas e do estado da vaga. */
export type Situacao = 'activa' | 'a-terminar' | 'pausada' | 'terminada';
export type FiltroSituacao = 'todas' | Situacao;
export type Ordem = 'candidaturas' | 'visualizacoes' | 'prazo';

const DIA_MS = 24 * 60 * 60 * 1000;
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const DIAS_RENOVACAO = 7;

@Component({
  selector: 'app-vagas-destaques',
  standalone: true,
  imports: [
    RouterLink,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './vagas-destaques.component.html',
  styleUrl: './vagas-destaques.component.css',
})
export class VagasDestaquesComponent {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  /** Rotas usadas pelos botões (ajusta às tuas). */
  readonly rotaCandidatos = '/empresa/candidatos';   // -> /empresa/candidatos/:id
  readonly rotaEditar = '/empresa/vagas/editar';     // -> /empresa/vagas/editar/:id
  readonly rotaDestacar = '/empresa/vagas';          // onde escolhe outra vaga para destacar

  vagas = signal<VagaDestacada[]>(this.exemplo());

  termo = signal('');
  filtro = signal<FiltroSituacao>('todas');
  ordem = signal<Ordem>('candidaturas');

  /** Id da vaga cujo destaque está à espera de confirmação para ser removido. */
  aConfirmar = signal<number | null>(null);

  readonly filtros: { valor: FiltroSituacao; texto: string }[] = [
    { valor: 'todas', texto: 'Todas' },
    { valor: 'activa', texto: 'Activas' },
    { valor: 'a-terminar', texto: 'A terminar' },
    { valor: 'pausada', texto: 'Pausadas' },
    { valor: 'terminada', texto: 'Terminadas' }
  ];

  /** Totais mostrados no cabeçalho. */
  resumo = computed(() => {
    const lista = this.vagas();
    return {
      vagas: lista.length,
      candidaturas: lista.reduce((soma, v) => soma + v.candidaturas, 0),
      novas: lista.reduce((soma, v) => soma + v.novasCandidaturas, 0)
    };
  });

  /** Quantas vagas há em cada filtro (aparece dentro do botão). */
  contagens = computed(() => {
    const contagem: Record<FiltroSituacao, number> = {
      todas: this.vagas().length, activa: 0, 'a-terminar': 0, pausada: 0, terminada: 0
    };
    for (const v of this.vagas()) {
      contagem[this.situacao(v)]++;
    }
    return contagem;
  });

  filtradas = computed(() => {
    const termo = this.normalizar(this.termo());
    const filtro = this.filtro();

    const lista = this.vagas().filter(v => {
      if (filtro !== 'todas' && this.situacao(v) !== filtro) {
        return false;
      }
      return !termo || this.normalizar(`${v.titulo} ${v.area}`).includes(termo);
    });

    switch (this.ordem()) {
      case 'visualizacoes':
        return lista.sort((a, b) => b.visualizacoes - a.visualizacoes);
      case 'prazo':
        return lista.sort((a, b) => Date.parse(a.destaqueFim) - Date.parse(b.destaqueFim));
      default:
        return lista.sort((a, b) => b.candidaturas - a.candidaturas);
    }
  });

  // ===================================================================
  //  2. ACÇÕES
  // ===================================================================

  aoPesquisar(evento: Event): void {
    this.termo.set((evento.target as HTMLInputElement).value);
  }

  aoOrdenar(evento: Event): void {
    this.ordem.set((evento.target as HTMLSelectElement).value as Ordem);
  }

  limparFiltros(): void {
    this.termo.set('');
    this.filtro.set('todas');
  }

  /** Prolonga o destaque por mais 7 dias (a partir de hoje, se já terminou). */
  renovar(id: number): void {
    this.vagas.update(lista => lista.map(v => {
      if (v.id !== id) {
        return v;
      }
      const terminou = Date.parse(v.destaqueFim) < Date.now();
      const base = terminou ? Date.now() : Date.parse(v.destaqueFim);
      return {
        ...v,
        destaqueInicio: terminou ? new Date().toISOString() : v.destaqueInicio,
        destaqueFim: new Date(base + DIAS_RENOVACAO * DIA_MS).toISOString()
      };
    }));
  }

  pedirRemocao(id: number): void {
    this.aConfirmar.set(id);
  }

  cancelarRemocao(): void {
    this.aConfirmar.set(null);
  }

  /** Tira a vaga dos destaques. A vaga continua publicada, só deixa de ser promovida. */
  confirmarRemocao(id: number): void {
    this.vagas.update(lista => lista.filter(v => v.id !== id));
    this.aConfirmar.set(null);
  }

  // ===================================================================
  //  3. TEXTOS E CÁLCULOS USADOS NO TEMPLATE
  // ===================================================================

  situacao(v: VagaDestacada): Situacao {
    if (Date.parse(v.destaqueFim) < Date.now()) {
      return 'terminada';
    }
    if (v.pausada) {
      return 'pausada';
    }
    return this.diasParaFim(v) <= 3 ? 'a-terminar' : 'activa';
  }

  textoSituacao(v: VagaDestacada): string {
    return {
      activa: 'Em destaque',
      'a-terminar': 'A terminar',
      pausada: 'Pausada',
      terminada: 'Destaque terminado'
    }[this.situacao(v)];
  }

  diasParaFim(v: VagaDestacada): number {
    return Math.ceil((Date.parse(v.destaqueFim) - Date.now()) / DIA_MS);
  }

  /** "Até 30 Out" ou "Terminou a 12 Out" */
  textoDestaque(v: VagaDestacada): string {
    const data = this.formatarData(v.destaqueFim);
    return this.situacao(v) === 'terminada' ? `Terminou a ${data}` : `Até ${data}`;
  }

  /** "Faltam 8 dias", "Termina amanhã", "Termina hoje" (vazio se já terminou). */
  textoPrazo(v: VagaDestacada): string {
    if (this.situacao(v) === 'terminada') {
      return '';
    }
    const dias = this.diasParaFim(v);
    if (dias <= 0) {
      return 'Termina hoje';
    }
    return dias === 1 ? 'Termina amanhã' : `Faltam ${dias} dias`;
  }

  /** 0 a 100: quanto do período do destaque já passou. */
  progresso(v: VagaDestacada): number {
    const inicio = Date.parse(v.destaqueInicio);
    const fim = Date.parse(v.destaqueFim);
    const decorrido = (Date.now() - inicio) / (fim - inicio);
    return Math.round(Math.min(1, Math.max(0, decorrido)) * 100);
  }

  /** Percentagem de visitantes que se candidataram: "4,8%" */
  conversao(v: VagaDestacada): string {
    if (v.visualizacoes === 0) {
      return '—';
    }
    return `${((v.candidaturas / v.visualizacoes) * 100).toFixed(1).replace('.', ',')}%`;
  }

  podeRenovar(v: VagaDestacada): boolean {
    const s = this.situacao(v);
    return s === 'a-terminar' || s === 'terminada';
  }

  localizacao(v: VagaDestacada): string {
    return [v.municipio, v.provincia].filter(t => t && t.trim()).join(', ');
  }

  /** "450.000 a 650.000 Kz" */
  textoSalario(v: VagaDestacada): string {
    if (v.salarioMin === null && v.salarioMax === null) {
      return 'A combinar';
    }
    if (v.salarioMin !== null && v.salarioMax !== null) {
      return `${this.formatarKz(v.salarioMin)} a ${this.formatarKz(v.salarioMax)} Kz`;
    }
    const valor = (v.salarioMin ?? v.salarioMax) as number;
    return `${v.salarioMin !== null ? 'Desde' : 'Até'} ${this.formatarKz(valor)} Kz`;
  }

  /** 80000 -> "80.000" */
  formatarKz(valor: number): string {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /** "2026-10-30T..." -> "30 Out" */
  private formatarData(iso: string): string {
    const d = new Date(iso);
    return `${d.getDate()} ${MESES[d.getMonth()]}`;
  }

  /** Minúsculas e sem acentos, para a pesquisa ignorar "é" vs "e". */
  private normalizar(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  /** Data ISO daqui a `n` dias (negativo = no passado). */
  private emDias(n: number): string {
    return new Date(Date.now() + n * DIA_MS).toISOString();
  }

  // ===================================================================
  //  4. VAGAS DE EXEMPLO
  // ===================================================================

  private exemplo(): VagaDestacada[] {
    return [
      {
        id: 1,
        titulo: 'Engenheiro de Software .NET e Angular',
        area: 'Tecnologia',
        provincia: 'Luanda',
        municipio: 'Talatona',
        modalidade: 'Híbrido',
        contrato: 'Efectivo',
        salarioMin: 550000,
        salarioMax: 750000,
        pausada: false,
        destaqueInicio: this.emDias(-6),
        destaqueFim: this.emDias(8),
        visualizacoes: 1240,
        candidaturas: 58,
        novasCandidaturas: 9
      },
      {
        id: 2,
        titulo: 'Gestor de Operações Logísticas',
        area: 'Logística',
        provincia: 'Luanda',
        municipio: 'Viana',
        modalidade: 'Presencial',
        contrato: 'Efectivo',
        salarioMin: 420000,
        salarioMax: 560000,
        pausada: false,
        destaqueInicio: this.emDias(-12),
        destaqueFim: this.emDias(2),
        visualizacoes: 860,
        candidaturas: 41,
        novasCandidaturas: 3
      },
      {
        id: 3,
        titulo: 'Analista Financeiro Júnior',
        area: 'Finanças',
        provincia: 'Luanda',
        municipio: 'Ingombota',
        modalidade: 'Presencial',
        contrato: 'Contrato a prazo',
        salarioMin: 380000,
        salarioMax: 480000,
        pausada: true,
        destaqueInicio: this.emDias(-4),
        destaqueFim: this.emDias(10),
        visualizacoes: 410,
        candidaturas: 17,
        novasCandidaturas: 0
      },
      {
        id: 4,
        titulo: 'Designer de Produto Digital',
        area: 'Tecnologia',
        provincia: 'Luanda',
        municipio: 'Belas',
        modalidade: 'Remoto',
        contrato: 'Prestação de serviços',
        salarioMin: null,
        salarioMax: null,
        pausada: false,
        destaqueInicio: this.emDias(-21),
        destaqueFim: this.emDias(-3),
        visualizacoes: 1530,
        candidaturas: 96,
        novasCandidaturas: 0
      },
      {
        id: 5,
        titulo: 'Supervisor(a) de Loja',
        area: 'Comércio',
        provincia: 'Luanda',
        municipio: 'Cazenga',
        modalidade: 'Presencial',
        contrato: 'Efectivo',
        salarioMin: 300000,
        salarioMax: null,
        pausada: false,
        destaqueInicio: this.emDias(-2),
        destaqueFim: this.emDias(12),
        visualizacoes: 190,
        candidaturas: 6,
        novasCandidaturas: 6
      }
    ];
  }
}
