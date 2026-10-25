// =====================================================================
//  PlanosComponent
//  Página do painel da empresa para escolher um plano de destaque.
//  Rota:  empresa/planos
//
//  ATENÇÃO: os planos, preços e benefícios abaixo são VALORES DE EXEMPLO.
//  Troca-os pelos reais. Quando existir backend, esta lista vem da API.
// =====================================================================

import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';

export interface BeneficioPlano {
  texto: string;
  incluido: boolean;
}

export interface Plano {
  id: number;
  nome: string;
  descricao: string;
  duracaoDias: number;
  preco: number;            // em Kz, por vaga
  recomendado?: boolean;    // mostra a fita "Mais escolhido"
  beneficios: BeneficioPlano[];
}

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css',
})
export class PlanosComponent {

  // ===================================================================
  //  1. OS PLANOS  (valores de exemplo)
  // ===================================================================

  readonly planos: Plano[] = [
    {
      id: 1,
      nome: 'Essencial',
      descricao: 'Para vagas que precisam de um empurrão.',
      duracaoDias: 7,
      preco: 15000,
      beneficios: [
        { texto: 'Selo "Destaque" na lista de vagas', incluido: true },
        { texto: 'Posição prioritária nos resultados', incluido: false },
        { texto: 'Presença em "Vagas em Destaque" na página inicial', incluido: false },
        { texto: 'Partilha nas redes sociais', incluido: false },
        { texto: 'Relatório de visualizações', incluido: false }
      ]
    },
    {
      id: 2,
      nome: 'Profissional',
      descricao: 'O equilíbrio entre alcance e custo.',
      duracaoDias: 15,
      preco: 35000,
      recomendado: true,
      beneficios: [
        { texto: 'Selo "Destaque" na lista de vagas', incluido: true },
        { texto: 'Posição prioritária nos resultados', incluido: true },
        { texto: 'Presença em "Vagas em Destaque" na página inicial', incluido: true },
        { texto: 'Partilha nas redes sociais', incluido: false },
        { texto: 'Relatório de visualizações', incluido: false }
      ]
    },
    {
      id: 3,
      nome: 'Premium',
      descricao: 'Máxima visibilidade para as vagas mais urgentes.',
      duracaoDias: 30,
      preco: 60000,
      beneficios: [
        { texto: 'Selo "Destaque" na lista de vagas', incluido: true },
        { texto: 'Posição prioritária nos resultados', incluido: true },
        { texto: 'Presença em "Vagas em Destaque" na página inicial', incluido: true },
        { texto: 'Partilha nas redes sociais', incluido: true },
        { texto: 'Relatório de visualizações', incluido: true }
      ]
    }
  ];

  // ===================================================================
  //  2. ESTADO  (o plano escolhido)
  // ===================================================================

  planoSeleccionadoId = signal<number | null>(null);

  planoSeleccionado = computed(
    () => this.planos.find(p => p.id === this.planoSeleccionadoId()) ?? null
  );

  constructor(private router: Router) {}

  // ===================================================================
  //  3. ACÇÕES
  // ===================================================================

  /** Clicar outra vez no plano já escolhido desfaz a escolha. */
  seleccionar(id: number): void {
    this.planoSeleccionadoId.set(this.planoSeleccionadoId() === id ? null : id);
  }

  /**
   * Volta à lista de vagas com o plano escolhido no endereço.
   * TODO: o painel "Destacar a vaga" ainda não lê este parâmetro.
   */
  continuar(): void {
    const plano = this.planoSeleccionado();
    if (!plano) {
      return;
    }

    this.router.navigate(['/empresa/vagas-disponivel'], {
      queryParams: { plano: plano.id }
    });
  }

  // ===================================================================
  //  4. TEXTOS USADOS NO TEMPLATE
  // ===================================================================

  /** 15000 -> "15.000" */
  formatarKz(valor: number): string {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  precoPorDia(plano: Plano): number {
    return Math.round(plano.preco / plano.duracaoDias);
  }
}
