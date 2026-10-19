// =====================================================================
//  VagasComponent  (página pública de vagas)
//  Mostra as vagas PUBLICADAS, com pesquisa e paginação, a partir de
//  GET /api/public/vacancies  (sem token).
//  A secção "Vagas em Destaque" continua estática por agora.
// =====================================================================

import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { VagasPublicasService, VagaPublicaDTO } from '../../services/empresa/novas-vagas/public/vagas-publicas.service';
import { ProvinceService, ProvinceDTO } from '../../services/shared/province.service';
import { CategoryService, CategoryDTO } from '../../services/shared/category.service';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.css',
})
export class VagasComponent implements OnInit {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  /** Vagas por página (a grelha tem 3 colunas, por isso múltiplos de 3). */
  readonly tamanhoPagina = 12;

  /** Formulário de pesquisa do topo da página. */
  pesquisaForm: FormGroup;

  /** Listas que alimentam os <select> de localização e área. */
  provincias: ProvinceDTO[] = [];
  categorias: CategoryDTO[] = [];

  /** Resultado da pesquisa. */
  vagas = signal<VagaPublicaDTO[]>([]);
  total = signal(0);
  paginaActual = signal(1);
  totalPaginas = signal(0);

  /** Estado do carregamento. */
  aCarregar = signal(true);
  erro = signal(false);

  /** Números de página a mostrar (no máximo 5, à volta da página actual). */
  paginas = computed(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();

    if (total <= 1) {
      return [];
    }

    const inicio = Math.max(1, Math.min(actual - 2, total - 4));
    const fim = Math.min(total, inicio + 4);

    return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
  });

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

  // ===================================================================
  //  3. CONSTRUTOR
  // ===================================================================

  constructor(
    private fb: FormBuilder,
    private vagasService: VagasPublicasService,
    private provinceService: ProvinceService,
    private categoryService: CategoryService
  ) {
    this.pesquisaForm = this.fb.group({
      palavraChave: [''],
      localizacao: [null],   // id da província
      area: [null],          // id da categoria
      tipoContrato: [null]   // EmploymentType: 1 a 4
    });
  }

  // ===================================================================
  //  4. CICLO DE VIDA
  // ===================================================================

  ngOnInit(): void {
    this.provinceService.getAll().subscribe({
      next: (dados) => (this.provincias = dados),
      error: (err) => console.error('Erro ao carregar províncias:', err)
    });

    this.categoryService.getAll().subscribe({
      next: (dados) => (this.categorias = dados),
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });

    this.carregar();
  }

  // ===================================================================
  //  5. PESQUISA E PAGINAÇÃO
  // ===================================================================

  /** Ligado ao (ngSubmit): uma pesquisa nova volta sempre à página 1. */
  pesquisarVagas(): void {
    this.paginaActual.set(1);
    this.carregar();
  }

  irParaPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas() || pagina === this.paginaActual()) {
      return;
    }

    this.paginaActual.set(pagina);
    this.carregar();

    // Leva o utilizador de volta ao início da lista
    document.getElementById('lista-vagas')?.scrollIntoView({ behavior: 'smooth' });
  }

  private carregar(): void {
    const f = this.pesquisaForm.value;

    this.aCarregar.set(true);
    this.erro.set(false);

    this.vagasService.listar({
      q: (f.palavraChave ?? '').trim(),
      categoryId: f.area,
      provinceId: f.localizacao,
      contractType: f.tipoContrato,
      page: this.paginaActual(),
      pageSize: this.tamanhoPagina
    }).subscribe({
      next: (r) => {
        this.vagas.set(r.items);
        this.total.set(r.total);
        this.totalPaginas.set(r.totalPages);
        this.aCarregar.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar as vagas:', err);
        this.erro.set(true);
        this.aCarregar.set(false);
      }
    });
  }

  // ===================================================================
  //  6. TEXTOS DO CARTÃO  (usados no template)
  // ===================================================================

  contrato(v: VagaPublicaDTO): string {
    return v.contractType == null ? '' : (this.contratos[v.contractType] ?? '');
  }

  modalidade(v: VagaPublicaDTO): string {
    return v.workMode == null ? '' : (this.modalidades[v.workMode] ?? '');
  }

  experiencia(v: VagaPublicaDTO): string {
    return this.experiencias[v.minimumExperience] ?? '';
  }

  local(v: VagaPublicaDTO): string {
    return [v.municipality, v.provinceName].filter(t => t && t.trim()).join(', ');
  }
}
