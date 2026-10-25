// =====================================================================
//  Detalhe público de uma vaga
// =====================================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { VagasPublicasService } from '../../services/empresa/novas-vagas/public/vagas-publicas.service';
import { VagaPublicaDetalheDTO } from '../../services/empresa/novas-vagas/public/VagaPublicaDetalheDTO';

@Component({
  selector: 'app-vaga',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './vaga.component.html',
  styleUrl: './vaga.component.css',
})

export class VagaComponent implements OnInit {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  vaga = signal<VagaPublicaDetalheDTO | null>(null);
  aCarregar = signal(true);
  naoEncontrada = signal(false);
  erro = signal(false);

  // ===================================================================
  //  2. TRADUÇÃO DOS VALORES DA API  (iguais aos enums do backend)
  // ===================================================================

  private readonly contratos: Record<number, string> = {
    1: 'Efectivo', 2: 'Prazo certo', 3: 'Estágio', 4: 'Freelance'
  };

  private readonly modalidades: Record<number, string> = {
    1: 'Presencial', 2: 'Híbrido', 3: 'Remoto'
  };

  private readonly experiencias: Record<number, string> = {
    1: '1 ano de experiência',
    2: '2 a 3 anos de experiência',
    3: '4 a 5 anos de experiência',
    4: 'Mais de 5 anos de experiência'
  };

  private readonly escolaridades: Record<number, string> = {
    1: '7º / 8º Classe',
    2: '9º / 10º Classe',
    3: '11º / 13º Classe',
    4: 'Médio',
    5: 'Bacharel',
    6: 'Licenciatura ou equivalente',
    7: 'Mestrado',
    8: 'Doutoramento'
  };

  // ===================================================================
  //  3. CONSTRUTOR E CICLO DE VIDA
  // ===================================================================

  constructor(
    private route: ActivatedRoute,
    private vagasService: VagasPublicasService
  ) {}

  ngOnInit(): void {
    // paramMap (e não snapshot): ao ir de uma vaga para outra, o componente é reutilizado
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id) {
        this.naoEncontrada.set(true);
        this.aCarregar.set(false);
        return;
      }

      this.carregar(id);
    });
  }

  private carregar(id: number): void {
    this.aCarregar.set(true);
    this.naoEncontrada.set(false);
    this.erro.set(false);
    this.vaga.set(null);

    this.vagasService.obter(id).subscribe({
      next: (v) => {
        this.vaga.set(v);
        this.aCarregar.set(false);
        window.scrollTo({ top: 0 });
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.naoEncontrada.set(true);
        } else {
          console.error('Erro ao carregar a vaga:', err);
          this.erro.set(true);
        }
        this.aCarregar.set(false);
      }
    });
  }

  // ===================================================================
  //  4. TEXTOS USADOS NO TEMPLATE
  // ===================================================================

  contrato(v: VagaPublicaDetalheDTO): string {
    return v.contractType == null ? '' : (this.contratos[v.contractType] ?? '');
  }

  modalidade(v: VagaPublicaDetalheDTO): string {
    return v.workMode == null ? '' : (this.modalidades[v.workMode] ?? '');
  }

  experiencia(v: VagaPublicaDetalheDTO): string {
    return this.experiencias[v.minimumExperience] ?? '';
  }

  escolaridade(v: VagaPublicaDetalheDTO): string {
    return this.escolaridades[v.educationLevel] ?? '';
  }

  local(v: VagaPublicaDetalheDTO): string {
    return [v.municipality, v.provinceName].filter(t => t && t.trim()).join(', ');
  }

  /** "450.000 - 620.000" (sem o Kz); vazio se o salário não foi indicado. */
  salarioValores(v: VagaPublicaDetalheDTO): string {
    const formatar = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (v.salaryMin != null && v.salaryMax != null) {
      return `${formatar(v.salaryMin)} - ${formatar(v.salaryMax)}`;
    }
    if (v.salaryMin != null) {
      return `A partir de ${formatar(v.salaryMin)}`;
    }
    if (v.salaryMax != null) {
      return `Até ${formatar(v.salaryMax)}`;
    }
    return '';
  }

  /** Candidatura por email: abre o programa de email com o assunto preenchido. */
  mailto(v: VagaPublicaDetalheDTO): string {
    const assunto = encodeURIComponent('Candidatura: ' + v.title);
    return `mailto:${v.applicationTarget}?subject=${assunto}`;
  }

  candidaturaNoSite(v: VagaPublicaDetalheDTO): boolean {
    return v.applicationMethod === 1;
  }

  rotaCandidatura(v: VagaPublicaDetalheDTO): (string | number)[] {
    return ['/vaga', v.vacanciesId, 'candidatura'];
  }

  // TESTE TEMPORÁRIO — remover depois de testar
  testarCandidatura(): void {
    const v = this.vaga();

    if (!v) {
      console.log('A vaga ainda não foi carregada.');
      return;
    }

    console.log('ID da vaga:', v.vacanciesId);
    console.log('Título:', v.title);
    console.log('Vaga expirada:', v.isExpired);
    console.log('Método de candidatura:', v.applicationMethod);
    console.log('Candidatura no site:', this.candidaturaNoSite(v));
    console.log('Rota de candidatura:', this.rotaCandidatura(v));
  }
}
