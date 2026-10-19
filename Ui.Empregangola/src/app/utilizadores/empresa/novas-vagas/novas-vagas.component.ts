// =====================================================================
//  NovasVagasComponent
//  Formulário de vagas da empresa. Serve para dois modos:
//    - CRIAR:  rota  empresa/novas-vagas        -> POST /api/Vacancies
//    - EDITAR: rota  empresa/novas-vagas/:id    -> PUT  /api/Vacancies/{id}
// =====================================================================

import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Layout
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

// Serviços
import { NovasVagasService } from '../../../services/empresa/novas-vagas/novas-vagas.service';
import { ProvinceService, ProvinceDTO } from '../../../services/shared/province.service';
import { CategoryService, CategoryDTO } from '../../../services/shared/category.service';

// Modais
import { SuccessVagaComponent } from '../../../modals/success-vaga/success-vaga.component';
import { ErroVagaComponent } from '../../../modals/erro-vaga/erro-vaga.component';

@Component({
  selector: 'app-novas-vagas',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './novas-vagas.component.html',
  styleUrl: './novas-vagas.component.css',
})
export class NovasVagasComponent implements OnInit {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  /** Formulário principal (os controlos são criados no construtor). */
  form: FormGroup;

  /** Listas que alimentam os <select> de província e categoria. */
  provincias: ProvinceDTO[] = [];
  categorias: CategoryDTO[] = [];

  /** Benefícios disponíveis (a ordem define os controlos do FormArray). */
  readonly beneficiosDisponiveis = [
    'Seguro de saúde',
    'Subsídio de transporte',
    'Subsídio de alimentação',
    'Alojamento',
    'Formação paga',
    'Bónus por desempenho'
  ];

  // --- Modo de edição ---
  /** Id da vaga em edição; null quando se está a criar uma vaga nova. */
  vagaId = signal<number | null>(null);
  modoEdicao = computed(() => this.vagaId() !== null);

  /** Vaga publicada: só alguns campos se podem alterar. */
  vagaPublicada = signal(false);

  /** Vaga encerrada: nada se pode alterar. */
  vagaEncerrada = signal(false);

  // ===================================================================
  //  2. CONSTRUTOR  (definição do formulário e das regras)
  // ===================================================================

  constructor(
    private fb: FormBuilder,
    private novasVagasService: NovasVagasService,
    private provinceService: ProvinceService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.form = this.fb.group({
      // Informação básica
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      categoria: ['', [Validators.required]],
      numeroVagas: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      contrato: [null, [Validators.required]],     // EmploymentType: 1 a 4
      modalidade: [null, [Validators.required]],   // WorkMode: 1 a 3

      // Localização
      provincia: ['', [Validators.required]],
      municipio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      diaspora: [false],

      // Descrição
      descricao: ['', [Validators.required]],
      responsabilidades: [''],
      requisitos: [''],

      // Perfil do candidato
      escolaridade: [0],   // EducationLevel: 0 = Indiferente
      experiencia: [0],    // MinimumExperience: 0 = Sem experiência
      idiomas: [''],
      competencias: [''],

      // Remuneração e benefícios
      salarioMin: [null],
      salarioMax: [null],
      aCombinar: [false],
      beneficios: this.fb.array(
        this.beneficiosDisponiveis.map(() => this.fb.control(false))
      ),

      // Candidatura
      prazo: ['', [Validators.required]],
      candidatura: [1],    // ApplicationMethod: 1 = Plataforma, 2 = Email, 3 = Link
      candidaturaDestino: [''],
    });

    this.ligarSalarioACombinar();
    this.ligarDestinoCandidatura();

    this.form.valueChanges.subscribe(() => {
        this.atualizarProgresso();
        this.atualizarPrevisao();
      });
      this.atualizarProgresso();
      this.atualizarPrevisao();
  }

  // ===================================================================
  //  3. GETTERS  (usados no template)
  // ===================================================================

  get titulo() { return this.form.get('titulo'); }
  get categoria() { return this.form.get('categoria'); }
  get numeroVagas() { return this.form.get('numeroVagas'); }
  get contrato() { return this.form.get('contrato'); }
  get modalidade() { return this.form.get('modalidade'); }
  get provincia() { return this.form.get('provincia'); }
  get municipio() { return this.form.get('municipio'); }
  get descricao() { return this.form.get('descricao'); }
  get prazo() { return this.form.get('prazo'); }
  get candidatura() { return this.form.get('candidatura'); }
  get candidaturaDestino() { return this.form.get('candidaturaDestino'); }
  get beneficios() { return this.form.get('beneficios') as FormArray; }

  // ===================================================================
  //  4. CICLO DE VIDA
  // ===================================================================

  ngOnInit(): void {
    this.carregarProvincias();
    this.carregarCategorias();

    // Se a rota tem :id, o formulário abre em modo de edição
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.vagaId.set(id);
      this.carregarVagaParaEdicao(id);
    }
  }

  private carregarProvincias(): void {
    this.provinceService.getAll().subscribe({
      next: (dados) => {
        this.provincias = dados;
        this.atualizarPrevisao();
      },
      error: (err) => console.error('Erro ao carregar províncias:', err)
    });
  }

  private carregarCategorias(): void {
    this.categoryService.getAll().subscribe({
      next: (dados) => (this.categorias = dados),
      error: (err) => console.error('Erro ao carregar categorias:', err)
    });
  }

  // ===================================================================
  //  5. GUARDAR  (criar ou actualizar)
  // ===================================================================

  /** Ligado ao (ngSubmit) do formulário. */
  guardarNovaVaga(): void {
    if (this.vagaEncerrada()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.construirDto();
    const edicao = this.modoEdicao();

    const pedido$: Observable<unknown> = edicao
      ? this.novasVagasService.atualizarVaga(this.vagaId()!, dto)
      : this.novasVagasService.guardarVaga(dto);

    pedido$.subscribe({
      next: () => this.aoGuardarComSucesso(dto.title, edicao),
      error: (err: HttpErrorResponse) => this.aoFalhar(dto.title, err)
    });
  }


  /** Guarda a vaga como rascunho: só o título é obrigatório. */
  guardarRascunho(): void {
    if (this.modoEdicao()) {
      return;
    }

    const titulo = this.form.get('titulo')!;
    if (titulo.invalid) {
      titulo.markAsTouched();   // mostra a mensagem de erro do título
      return;
    }

    const dto = this.construirDto(true);

    this.novasVagasService.guardarVaga(dto).subscribe({
      next: () => this.aoGuardarComSucesso(dto.title, false, true),
      error: (err: HttpErrorResponse) => this.aoFalhar(dto.title, err)
    });
  }

  /** Converte os valores do formulário no formato que a API espera. */
  private construirDto(rascunho = false) {
    // getRawValue inclui também os campos desactivados (vaga publicada)
    const dados = this.form.getRawValue();

    const beneficiosSelecionados: string[] = dados.beneficios
      .map((marcado: boolean, i: number) => (marcado ? this.beneficiosDisponiveis[i] : null))
      .filter((b: string | null): b is string => b !== null);

    // Com "a combinar", não se envia valor de salário
    const aCombinar: boolean = dados.aCombinar;

    return {
      title: dados.titulo,
      categoryId: this.paraNumero(dados.categoria),
      numberOfVacancies: Number(dados.numeroVagas) || 1,
      contractType: this.paraNumero(dados.contrato),
      workMode: this.paraNumero(dados.modalidade),
      provinceId: this.paraNumero(dados.provincia),
      municipality: dados.municipio,
      diaspora: dados.diaspora,
      description: dados.descricao,
      responsibilities: this.paraLista(dados.responsabilidades, /\r?\n/),
      requirements: this.paraLista(dados.requisitos, /\r?\n/),
      educationLevel: Number(dados.escolaridade),
      experienceLevel: Number(dados.experiencia),
      languages: this.paraLista(dados.idiomas, /,/),
      skills: this.paraLista(dados.competencias, /,/),
      salaryMin: aCombinar ? null : this.paraNumero(dados.salarioMin),
      salaryMax: aCombinar ? null : this.paraNumero(dados.salarioMax),
      negotiableSalary: aCombinar,
      benefits: beneficiosSelecionados,
      deadline: dados.prazo || null,
      applicationMethod: Number(dados.candidatura),
      applicationTarget: dados.candidaturaDestino ?? '',
      isDraft: rascunho
    };
  }

  /** Mostra o modal de sucesso; ao fechar, volta à lista (edição) ou limpa o formulário (criação). */
  private aoGuardarComSucesso(titulo: string, edicao: boolean, rascunho = false): void {
    this.dialog
      .open(SuccessVagaComponent, {
        width: '420px',
        disableClose: true,
        data: { titulo, edicao, rascunho }
      })
      .afterClosed()
      .subscribe(() => {
        if (edicao) {
          this.location.back();
        } else {
          this.limparFormulario();
        }
      });
  }

  /** Mostra o modal de erro com as mensagens devolvidas pela API. */
  private aoFalhar(titulo: string, err: HttpErrorResponse): void {
    console.error('Erro ao guardar vaga:', err.error ?? err);

    this.dialog.open(ErroVagaComponent, {
      width: '420px',
      data: {
        titulo,
        mensagens: this.extrairMensagens(err)
      }
    });
  }

  // ===================================================================
  //  6. MODO DE EDIÇÃO  (carregar a vaga e aplicar restrições)
  // ===================================================================

  /** Vai buscar a vaga completa e preenche o formulário. */
  private carregarVagaParaEdicao(id: number): void {
    this.novasVagasService.getVagaPorId(id).subscribe({
      next: (v) => {
        this.form.patchValue({
          titulo: v.title,
          categoria: v.categoryId ?? '',
          numeroVagas: v.numberOfVacancies,
          contrato: v.contractType,
          modalidade: v.workMode,
          provincia: v.provinceId ?? '',
          municipio: v.municipality,
          diaspora: v.diaspora,
          descricao: v.description,
          responsabilidades: v.responsibilities.join('\n'),
          requisitos: v.requirements.join('\n'),
          escolaridade: v.educationLevel,
          experiencia: v.experienceLevel,
          idiomas: v.languages.join(', '),
          competencias: v.skills.join(', '),
          salarioMin: v.salaryMin,
          salarioMax: v.salaryMax,
          aCombinar: v.negotiableSalary,
          beneficios: this.beneficiosDisponiveis.map(b => v.benefits.includes(b)),
          prazo: v.deadline ? v.deadline.substring(0, 10) : '',     // o <input type="date"> quer yyyy-MM-dd
          candidatura: v.applicationMethod,        // tem de vir antes do destino
          candidaturaDestino: v.applicationTarget
        });

        this.aplicarRestricoes(v.status);
      },
      error: (err) => console.error('Erro ao carregar a vaga para edição:', err)
    });
  }

  /**
   * Encerrada (4): nada se edita.
   * Publicada (3): só os campos que não mudam o que os candidatos já viram.
   * O emitEvent:false evita que o listener do "a combinar" volte a activar o salário.
  */
  private aplicarRestricoes(status: number): void {
    if (status === 4) {
      this.vagaEncerrada.set(true);
      this.form.disable({ emitEvent: false });
      this.atualizarProgresso();
      return;
    }

    if (status === 3) {
      this.vagaPublicada.set(true);

      const bloqueados = [
        'titulo', 'categoria', 'numeroVagas', 'contrato', 'modalidade',
        'provincia', 'municipio', 'diaspora', 'escolaridade', 'experiencia',
        'salarioMin', 'salarioMax', 'aCombinar'
      ];

      bloqueados.forEach(c => this.form.get(c)?.disable({ emitEvent: false }));
    }

    this.atualizarProgresso();
  }
  // ===================================================================
  //  7. REGRAS ENTRE CAMPOS
  // ===================================================================

  /** "Salário a combinar" desactiva e limpa os dois campos de salário. */
  private ligarSalarioACombinar(): void {
    const min = this.form.get('salarioMin')!;
    const max = this.form.get('salarioMax')!;

    this.form.get('aCombinar')!.valueChanges.subscribe((aCombinar: boolean) => {
      if (aCombinar) {
        min.reset(null);
        max.reset(null);
        min.disable();
        max.disable();
      } else {
        min.enable();
        max.enable();
      }
    });
  }

  /** O destino só é obrigatório se a candidatura for por email (2) ou link (3). */
  private ligarDestinoCandidatura(): void {
    const destino = this.form.get('candidaturaDestino')!;

    this.form.get('candidatura')!.valueChanges.subscribe((metodo: number | string) => {
      const m = Number(metodo);

      if (m === 2) {
        destino.setValidators([Validators.required, Validators.email]);
      } else if (m === 3) {
        destino.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/i)]);
      } else {
        destino.clearValidators();
        destino.reset('');
      }

      destino.updateValueAndValidity();
    });
  }

  // ===================================================================
  //  8. MENSAGENS DE ERRO DA API
  // ===================================================================

  /** Extrai uma lista de textos legíveis a partir da resposta de erro. */
  private extrairMensagens(err: HttpErrorResponse): string[] {
    if (err.status === 0) {
      return ['Não foi possível contactar o servidor. Verifique a ligação e tente novamente.'];
    }
    if (err.status === 401) {
      return ['A sessão expirou. Inicie sessão novamente.'];
    }

    const corpo = err.error;
    const mensagens: string[] = [];

    // { errors: { "Campo": ["mensagem", ...] } }  ou  { errors: [ { errorMessage }, ... ] }
    if (corpo?.errors && typeof corpo.errors === 'object') {
      if (Array.isArray(corpo.errors)) {
        for (const e of corpo.errors) {
          mensagens.push(typeof e === 'string' ? e : (e.errorMessage ?? e.message ?? ''));
        }
      } else {
        for (const [campo, msgs] of Object.entries(corpo.errors)) {
          // "$.contractType" e "command" são erros técnicos de leitura do JSON
          if (campo.startsWith('$') || campo === 'command') continue;
          mensagens.push(...(msgs as string[]));
        }
      }
    }

    // { message: "..." }  (formato do middleware e do 409 da edição)
    if (mensagens.length === 0 && corpo?.message) {
      mensagens.push(corpo.message);
    }

    if (mensagens.length === 0 && typeof corpo === 'string' && corpo) {
      mensagens.push(corpo);
    }

    const limpas = mensagens.filter(m => m && m.trim().length > 0);
    return limpas.length > 0
      ? limpas
      : ['Ocorreu um erro inesperado. Tente novamente.'];
  }

  // ===================================================================
  //  9. AUXILIARES
  // ===================================================================

  /** Repõe o formulário nos valores iniciais (depois de criar uma vaga). */
  private limparFormulario(): void {
    this.form.reset({
      titulo: '',
      categoria: '',
      numeroVagas: 1,
      contrato: null,
      modalidade: null,
      provincia: '',
      municipio: '',
      diaspora: false,
      descricao: '',
      responsabilidades: '',
      requisitos: '',
      escolaridade: 0,
      experiencia: 0,
      idiomas: '',
      competencias: '',
      salarioMin: null,
      salarioMax: null,
      aCombinar: false,
      beneficios: this.beneficiosDisponiveis.map(() => false),
      prazo: '',
      candidatura: 1,
      candidaturaDestino: ''
    });
  }

  /** "a, b, c" -> ['a', 'b', 'c']  (sem vazios). */
  private paraLista(texto: string | null, separador: RegExp): string[] {
    return (texto ?? '')
      .split(separador)
      .map(t => t.trim())
      .filter(t => t.length > 0);
  }

  /** Converte para número; vazio ou inválido -> null. */
  private paraNumero(valor: number | string | null): number | null {
    if (valor === null || valor === '') {
      return null;
    }
    const n = Number(valor);
    return Number.isNaN(n) ? null : n;
  }

  // --- Barra de progresso (campos obrigatórios preenchidos) ---
  private readonly camposObrigatorios = [
    'titulo', 'categoria', 'numeroVagas', 'contrato', 'modalidade',
    'provincia', 'municipio', 'descricao', 'prazo'
  ];

  progresso = signal({ preenchidos: 0, total: 0, percentagem: 0 });

  private atualizarProgresso(): void {
    const obrigatorios = [...this.camposObrigatorios];

    // O destino da candidatura só conta com email (2) ou link (3)
    const metodo = Number(this.form.get('candidatura')?.value);
    if (metodo === 2 || metodo === 3) {
      obrigatorios.push('candidaturaDestino');
    }

    // Um campo bloqueado (vaga publicada) já está resolvido, por isso conta como preenchido
    const preenchidos = obrigatorios.filter(nome => {
      const c = this.form.get(nome);
      return !!c && (c.disabled || c.valid);
    }).length;

    this.progresso.set({
      preenchidos,
      total: obrigatorios.length,
      percentagem: Math.round((preenchidos / obrigatorios.length) * 100)
    });
  }

  // --- Pré-visualização (a parte do formulário que o candidato vai ver) ---
  private readonly nomesContrato: Record<number, string> = {
    1: 'Efectivo', 2: 'Prazo certo', 3: 'Estágio', 4: 'Freelance'
  };

  private readonly nomesModalidade: Record<number, string> = {
    1: 'Presencial', 2: 'Híbrido', 3: 'Remoto'
  };

  previsao = signal({
    titulo: '',
    contrato: '',
    modalidade: '',
    local: '',
    salario: '',
    prazo: ''
  });

  private atualizarPrevisao(): void {
    const d = this.form.getRawValue();

    // Local: município + nome da província (o formulário só guarda o número)
    const provincia = this.provincias.find(p => p.provinceId === Number(d.provincia))?.name ?? '';
    const municipio = (d.municipio ?? '').trim();
    const local = [municipio, provincia].filter(t => t).join(', ');

    this.previsao.set({
      titulo: (d.titulo ?? '').trim(),
      contrato: this.nomesContrato[Number(d.contrato)] ?? '',
      modalidade: this.nomesModalidade[Number(d.modalidade)] ?? '',
      local,
      salario: this.textoSalario(d),
      prazo: this.textoPrazo(d.prazo)
    });
  }

  private textoSalario(d: any): string {
    if (d.aCombinar) {
      return 'A combinar';
    }

    const min = this.paraNumero(d.salarioMin);
    const max = this.paraNumero(d.salarioMax);
    const formatar = (n: number) => n.toLocaleString('pt-PT');

    if (min !== null && max !== null) return `${formatar(min)} – ${formatar(max)} Kz`;
    if (min !== null) return `A partir de ${formatar(min)} Kz`;
    if (max !== null) return `Até ${formatar(max)} Kz`;
    return '';
  }

  // yyyy-MM-dd -> dd-MM-yyyy (sem passar por Date, para não haver problemas de fuso horário)
  private textoPrazo(valor: string | null): string {
    if (!valor) {
      return '';
    }
    const [ano, mes, dia] = valor.split('-');
    return ano && mes && dia ? `${dia}-${mes}-${ano}` : '';
  }
}
