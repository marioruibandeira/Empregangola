// =====================================================================
//  CandidaturaComponent
//  Página onde o candidato se candidata a uma vaga, no próprio site.
//  Rota:  vaga/:id/candidatura
//
//  Fluxo: o candidato lê a vaga, carrega em "Candidatar-se" e chega aqui.
//    - sem sessão iniciada  -> pede para iniciar sessão ou registar-se
//    - vaga com prazo terminado -> não deixa candidatar-se
//    - caso normal -> dados do perfil, CV, carta, consentimento e envio
//
//  A vaga vem da API pública. O envio usa o CriarCandidatura
//  (POST /api/JobApplication). O resumo do perfil ainda é SIMULADO no
//  CandidaturasService até existir o endpoint.
// =====================================================================

import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import {
  VagasPublicasService,
  VagaPublicaDetalheDTO
} from '../../services/empresa/novas-vagas/public/vagas-publicas.service';
import {
  CandidaturasService,
  PerfilResumo
} from '../../services/empresa/novas-vagas/public/candidaturas.service';
import {
  CriarCandidatura,
  CandidaturasDto
} from '../../services/empresa/novas-vagas/candidaturas/candidaturas.services';
import { AuthService } from '../../auth/auth.service';

const MAX_CV_MB = 5;
const MAX_CARTA = 2000;

/** O que a página mostra depois de a candidatura ser enviada. */
export interface ResultadoEnvio {
  referencia: string | null;   // só aparece se a API devolver um identificador
  enviadaEm: string;           // ISO 8601
}

@Component({
  selector: 'app-candidatura',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './candidatura.component.html',
  styleUrl: './candidatura.component.css',
})
export class CandidaturaComponent implements OnInit {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  readonly maxCarta = MAX_CARTA;
  readonly maxCvMb = MAX_CV_MB;

  /** `dias` é o número que a API recebe em StartAvailability (0 = imediata). */
  readonly disponibilidades = [
    { dias: 1, texto: 'Imediata' },
    { dias: 2, texto: '15 dias' },
    { dias: 3, texto: '30 dias' },
    { dias: 4, texto: '60 dias ou mais' }
  ];

  // --- A vaga ---
  vaga = signal<VagaPublicaDetalheDTO | null>(null);
  aCarregar = signal(true);
  naoEncontrada = signal(false);
  erroVaga = signal(false);

  // --- O candidato ---
  autenticado = signal(false);
  perfil = signal<PerfilResumo | null>(null);

  /** Onde o utilizador volta depois de iniciar sessão. */
  voltarPara = computed(() => `/vaga/${this.vaga()?.vacanciesId ?? ''}/candidatura`);

  // --- O formulário ---
  form: FormGroup;
  ficheiro = signal<File | null>(null);
  erroFicheiro = signal<string | null>(null);

  /** Passa a true na primeira tentativa de enviar (mostra os erros). */
  tentou = signal(false);

  // --- O envio ---
  aEnviar = signal(false);
  erroEnvio = signal<string | null>(null);
  resultado = signal<ResultadoEnvio | null>(null);

  // ===================================================================
  //  2. TRADUÇÃO DOS VALORES DA API  (iguais aos enums do backend)
  // ===================================================================

  private readonly contratos: Record<number, string> = {
    1: 'Efectivo', 2: 'Prazo certo', 3: 'Estágio', 4: 'Freelance'
  };

  private readonly modalidades: Record<number, string> = {
    1: 'Presencial', 2: 'Híbrido', 3: 'Remoto'
  };

  // ===================================================================
  //  3. CONSTRUTOR E CICLO DE VIDA
  // ===================================================================

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private vagasService: VagasPublicasService,
    private candidaturasService: CandidaturasService,
    private criarCandidatura: CriarCandidatura,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      origemCv: ['perfil'],
      carta: ['', [Validators.maxLength(MAX_CARTA)]],
      pretensao: [null, [Validators.min(0)]],
      disponibilidade: [null, [Validators.required]],   // número de dias; a API exige um valor
      consentimento: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    const sessaoValida = this.authService.isLoggedIn();
    this.autenticado.set(sessaoValida);

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id) {
        this.naoEncontrada.set(true);
        this.aCarregar.set(false);
        return;
      }

      this.carregarVaga(id);
    });

    if (sessaoValida) {
      this.carregarPerfil();
    }
  }

  private carregarVaga(id: number): void {
    this.aCarregar.set(true);
    this.naoEncontrada.set(false);
    this.erroVaga.set(false);

    this.vagasService.obter(id).subscribe({
      next: (v) => {
        this.vaga.set(v);
        this.aCarregar.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.naoEncontrada.set(true);
        } else {
          console.error('Erro ao carregar a vaga:', err);
          this.erroVaga.set(true);
        }
        this.aCarregar.set(false);
      }
    });
  }

  private carregarPerfil(): void {
    this.candidaturasService.obterPerfilResumo().subscribe({
      next: (p) => {
        this.perfil.set(p);
        if (!p) {
          return;
        }

        // Pré-preenche com o que o candidato já indicou no perfil
        this.form.patchValue({
          origemCv: p.cvNome ? 'perfil' : 'novo',
          pretensao: p.pretensaoSalarial,
          disponibilidade: this.disponibilidades.find(d => d.texto === p.disponibilidade)?.dias ?? null
        });
      },
      error: (err) => console.error('Erro ao carregar o perfil:', err)
    });
  }

  // ===================================================================
  //  4. GETTERS  (usados no template)
  // ===================================================================

  get consentimento() { return this.form.get('consentimento'); }
  get pretensao() { return this.form.get('pretensao'); }
  get disponibilidade() { return this.form.get('disponibilidade'); }
  get cartaTamanho(): number { return String(this.form.get('carta')?.value ?? '').length; }

  // ===================================================================
  //  5. CV
  // ===================================================================

  aoEscolherFicheiro(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const escolhido = input.files?.[0] ?? null;

    this.ficheiro.set(null);
    this.erroFicheiro.set(null);

    if (!escolhido) {
      return;
    }

    if (!/\.(pdf|docx?)$/i.test(escolhido.name)) {
      this.erroFicheiro.set('Use um ficheiro PDF, DOC ou DOCX.');
      input.value = '';
      return;
    }

    if (escolhido.size > MAX_CV_MB * 1024 * 1024) {
      this.erroFicheiro.set(`O ficheiro tem mais de ${MAX_CV_MB} MB.`);
      input.value = '';
      return;
    }

    this.ficheiro.set(escolhido);
  }

  /** O CV está resolvido: ou usa o do perfil, ou carregou outro. */
  cvOk(): boolean {
    return this.form.value.origemCv === 'perfil'
      ? !!this.perfil()?.cvNome
      : !!this.ficheiro();
  }

  tamanhoLegivel(f: File): string {
    return f.size >= 1024 * 1024
      ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(f.size / 1024))} KB`;
  }

  // ===================================================================
  //  6. ENVIO
  // ===================================================================

  async enviar(): Promise<void> {
    this.erroEnvio.set(null);
    this.tentou.set(true);

    const vaga = this.vaga();
    if (!vaga || this.aEnviar()) {
      return;
    }

    if (this.form.invalid || !this.cvOk()) {
      this.form.markAllAsTouched();
      return;
    }

    this.aEnviar.set(true);

    // O backend recebe o CV novo como texto (NewCv): lemos o ficheiro para um data URL
    let novoCv = '';
    if (this.form.value.origemCv === 'novo') {
      try {
        novoCv = await this.lerFicheiro(this.ficheiro()!);
      } catch {
        this.aEnviar.set(false);
        this.erroEnvio.set('Não foi possível ler o ficheiro do CV. Tente novamente.');
        return;
      }
    }

    const dados = this.montarPedido(vaga, novoCv);

    this.criarCandidatura.guardarCandidatura(dados).subscribe({
      next: (resposta) => {
        this.resultado.set({
          referencia: this.extrairReferencia(resposta),
          enviadaEm: dados.AppliedDate
        });
        this.aEnviar.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err: HttpErrorResponse) => {
        this.aEnviar.set(false);
        this.erroEnvio.set(this.mensagemDeErro(err));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /** Passa do formulário para o formato que a API espera (CandidaturasDto). */
  private montarPedido(vaga: VagaPublicaDetalheDTO, novoCv: string): CandidaturasDto {
    const v = this.form.value;

    return {
      UseProfileCv: v.origemCv === 'perfil',
      NewCv: novoCv,
      PresentationLetter: (v.carta ?? '').trim(),
      SalaryPretention: v.pretensao === null || v.pretensao === '' ? 0 : Number(v.pretensao),   // 0 = não indicada
      StartAvailability: Number(v.disponibilidade),                                             // dias; 0 = imediata
      ShareCv: !!v.consentimento,
      AppliedDate: new Date().toISOString(),
      AppUserId: this.idDoUtilizador(),
      VacancyId: vaga.vacanciesId
    };
  }

  /** Lê o ficheiro como data URL ("data:application/pdf;base64,...."). */
  private lerFicheiro(ficheiro: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(String(leitor.result));
      leitor.onerror = () => reject(leitor.error);
      leitor.readAsDataURL(ficheiro);
    });
  }

  /**
   * Id do utilizador, lido do token. A API NÃO deve confiar neste valor:
   * tem de o substituir pelo id que vem do token, como fazemos nas vagas.
   */
  private idDoUtilizador(): string {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return '';
      }

      const corpo = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(corpo));

      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        ?? payload['nameid']
        ?? payload['sub']
        ?? '';
    } catch {
      return '';
    }
  }

  /** Se a API devolver um identificador da candidatura, mostra-o como referência. */
  private extrairReferencia(resposta: any): string | null {
    const id = resposta?.jobApplicationId ?? resposta?.id ?? resposta?.Id;
    return id != null ? `CAND-${id}` : null;
  }

  private mensagemDeErro(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Não foi possível contactar o servidor. Verifique a ligação e tente novamente.';
    }
    if (err.status === 401) {
      return 'A sua sessão expirou. Inicie sessão novamente para se candidatar.';
    }

    // Erros de validação: { errors: { Campo: ["mensagem"] } }
    const erros = err.error?.errors;
    if (erros && typeof erros === 'object') {
      const lista = (Object.values(erros).flat() as unknown[]).filter(m => typeof m === 'string') as string[];
      if (lista.length > 0) {
        return lista.join(' ');
      }
    }

    if (err.status === 409) {
      return err.error?.message ?? 'Já se candidatou a esta vaga.';
    }
    return err.error?.message ?? 'Não foi possível enviar a candidatura. Tente novamente.';
  }

  // ===================================================================
  //  7. TEXTOS USADOS NO TEMPLATE
  // ===================================================================

  iniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/).filter(p => p.length > 0);
    if (partes.length === 0) {
      return '?';
    }
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (partes[0][0] + ultima).toUpperCase();
  }

  local(v: VagaPublicaDetalheDTO): string {
    return [v.municipality, v.provinceName].filter(t => t && t.trim()).join(', ');
  }

  contrato(v: VagaPublicaDetalheDTO): string {
    return v.contractType == null ? '' : (this.contratos[v.contractType] ?? '');
  }

  modalidade(v: VagaPublicaDetalheDTO): string {
    return v.workMode == null ? '' : (this.modalidades[v.workMode] ?? '');
  }
}
