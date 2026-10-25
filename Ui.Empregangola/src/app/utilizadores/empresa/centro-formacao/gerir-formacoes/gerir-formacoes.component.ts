// =====================================================================
//  GerirFormacoesComponent
//  Página do painel do centro de formação para gerir as formações:
//    - LISTA:   ver, pesquisar, filtrar por estado, publicar, arquivar, eliminar
//    - EDITOR:  criar e editar uma formação (os campos espelham a página
//               pública de detalhe da formação)
//
//  Rota:  empresa/formacoes
//
//  ATENÇÃO: por agora os dados ficam em memória (perdem-se ao recarregar
//  a página) e as três formações da lista são EXEMPLOS. Quando existir
//  backend, troca-se o signal `formacoes` por chamadas à API.
// =====================================================================

import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { BesidebarComponent } from '../../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../../shared/befooter/befooter.component';

// ---------------------------------------------------------------------
//  Regras para publicar (edita aqui os mínimos)
// ---------------------------------------------------------------------
const MIN_DESCRICAO = 100;
const MIN_OBJECTIVOS = 1;
const PADRAO_DURACAO = /^(\d{1,2}:)?\d{1,2}:[0-5]\d$/;   // mm:ss ou h:mm:ss

// ---------------------------------------------------------------------
//  Modelos
// ---------------------------------------------------------------------
export type EstadoFormacao = 'rascunho' | 'publicada' | 'arquivada';
export type TipoAula = 'video' | 'leitura' | 'exercicio' | 'quiz';

export interface Aula {
  nome: string;
  tipo: TipoAula;
  duracao: string;      // "3:27"
  preview: boolean;     // pré-visualização gratuita
}

export interface Modulo {
  titulo: string;
  aulas: Aula[];
}

/** O que o editor lê e grava (sem identificação nem estado). */
export interface DadosFormacao {
  titulo: string;
  subtitulo: string;
  area: string;
  subarea: string;
  topico: string;
  idioma: string;
  imagem: string;
  aprender: string[];
  inclui: string[];
  modulos: Modulo[];
  requisitos: string[];
  descricao: string;
  topicos: string[];
  preco: number | null;
  incluidaSubscricao: boolean;
  formador: string;
  formadorBio: string;
}

export interface Formacao extends DadosFormacao {
  id: number;
  estado: EstadoFormacao;
  actualizadaEm: string;   // ISO 8601
}

interface Verificacao {
  texto: string;
  ok: boolean;
}

@Component({
  selector: 'app-gerir-formacoes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './gerir-formacoes.component.html',
  styleUrl: './gerir-formacoes.component.css',
})
export class GerirFormacoesComponent {

  // ===================================================================
  //  1. LISTAS FIXAS DO FORMULÁRIO  (valores de exemplo)
  // ===================================================================

  readonly areas = [
    'Desenvolvimento', 'Negócios', 'Design', 'Marketing',
    'Finanças e Contabilidade', 'Recursos Humanos', 'Engenharia', 'Saúde'
  ];

  readonly idiomas = ['Português', 'Inglês', 'Francês'];

  readonly tiposAula: { valor: TipoAula; texto: string }[] = [
    { valor: 'video', texto: 'Vídeo' },
    { valor: 'leitura', texto: 'Leitura' },
    { valor: 'exercicio', texto: 'Exercício' },
    { valor: 'quiz', texto: 'Quiz' }
  ];

  // ===================================================================
  //  2. ESTADO
  // ===================================================================

  /** Que ecrã está visível. */
  vista = signal<'lista' | 'editor'>('lista');

  /** As formações (em memória, por agora). */
  formacoes = signal<Formacao[]>(this.exemplos());
  private proximoId = 100;

  /** Filtros da lista. */
  filtroTexto = signal('');
  filtroEstado = signal<'' | EstadoFormacao>('');

  lista = computed(() => {
    const texto = this.filtroTexto().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.formacoes().filter(f =>
      (!estado || f.estado === estado) &&
      (!texto || f.titulo.toLowerCase().includes(texto) || f.area.toLowerCase().includes(texto))
    );
  });

  /** Mensagem de sucesso ou erro, no topo da página. */
  mensagem = signal<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  /** Formação com a confirmação de "eliminar" aberta. */
  eliminarId = signal<number | null>(null);

  // --- Editor ---
  form: FormGroup;

  /** Id da formação em edição; null = formação nova. */
  editandoId = signal<number | null>(null);

  /** Estado da formação em edição; null = formação nova. */
  estadoEditado = signal<EstadoFormacao | null>(null);

  /** Só as formações novas e os rascunhos se podem voltar a guardar como rascunho. */
  podeRascunho = computed(() => this.estadoEditado() === null || this.estadoEditado() === 'rascunho');

  /** Itens em falta, mostrados no topo do editor depois de uma tentativa de gravar. */
  faltas = signal<string[]>([]);

  /** Contagens e lista de verificação da barra lateral. */
  resumo = signal<{ modulos: number; aulas: number; duracao: string; verificacoes: Verificacao[] }>({
    modulos: 0, aulas: 0, duracao: '0min', verificacoes: []
  });

  // ===================================================================
  //  3. CONSTRUTOR
  // ===================================================================

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      subtitulo: ['', [Validators.maxLength(250)]],
      area: [''],
      subarea: [''],
      topico: [''],
      idioma: ['Português'],
      imagem: [''],
      aprender: this.fb.array([]),
      inclui: this.fb.array([]),
      modulos: this.fb.array([]),
      requisitos: this.fb.array([]),
      descricao: [''],
      topicos: [''],                 // separados por vírgulas
      preco: [null],
      incluidaSubscricao: [false],
      formador: [''],
      formadorBio: ['']
    });

    this.form.valueChanges.subscribe(() => this.actualizarResumo());
    this.preencher(null);
  }

  // ===================================================================
  //  4. GETTERS  (usados no template)
  // ===================================================================

  get titulo() { return this.form.get('titulo'); }
  get aprenderArr() { return this.form.get('aprender') as FormArray; }
  get incluiArr() { return this.form.get('inclui') as FormArray; }
  get requisitosArr() { return this.form.get('requisitos') as FormArray; }
  get modulosArr() { return this.form.get('modulos') as FormArray; }

  aulasDe(indiceModulo: number): FormArray {
    return this.modulosArr.at(indiceModulo).get('aulas') as FormArray;
  }

  // ===================================================================
  //  5. LISTA
  // ===================================================================

  valorDe(evento: Event): string {
    return (evento.target as HTMLInputElement).value;
  }

  novaFormacao(): void {
    this.mensagem.set(null);
    this.editandoId.set(null);
    this.estadoEditado.set(null);
    this.faltas.set([]);
    this.preencher(null);
    this.vista.set('editor');
  }

  editar(f: Formacao): void {
    this.mensagem.set(null);
    this.editandoId.set(f.id);
    this.estadoEditado.set(f.estado);
    this.faltas.set([]);
    this.preencher(f);
    this.vista.set('editor');
  }

  /** Publicar, arquivar ou republicar a partir da lista. */
  alterarEstado(f: Formacao, novo: EstadoFormacao): void {
    if (novo === 'publicada') {
      const naoOk = this.verificacoes(f).filter(v => !v.ok).map(v => v.texto);
      if (naoOk.length > 0) {
        this.mensagem.set({
          tipo: 'erro',
          texto: `Não é possível publicar "${f.titulo}". Falta: ${naoOk.join('; ')}.`
        });
        return;
      }
    }

    this.formacoes.update(lista =>
      lista.map(x => x.id === f.id ? { ...x, estado: novo, actualizadaEm: new Date().toISOString() } : x)
    );

    const acao = novo === 'publicada' ? 'publicada' : novo === 'arquivada' ? 'arquivada' : 'guardada como rascunho';
    this.mensagem.set({ tipo: 'sucesso', texto: `A formação "${f.titulo}" foi ${acao}.` });
  }

  pedirEliminar(id: number): void {
    this.eliminarId.set(id);
  }

  cancelarEliminar(): void {
    this.eliminarId.set(null);
  }

  eliminar(f: Formacao): void {
    this.formacoes.update(lista => lista.filter(x => x.id !== f.id));
    this.eliminarId.set(null);
    this.mensagem.set({ tipo: 'sucesso', texto: `A formação "${f.titulo}" foi eliminada.` });
  }

  // ===================================================================
  //  6. EDITOR: ACÇÕES
  // ===================================================================

  /** Rascunho: só o título é obrigatório. */
  guardarRascunho(): void {
    const titulo = this.form.get('titulo')!;

    if (titulo.invalid) {
      titulo.markAsTouched();
      this.faltas.set(['Título com pelo menos 5 caracteres']);
      return;
    }

    this.gravar('rascunho');
  }

  /** Publicar: a formação tem de estar completa. */
  publicar(): void {
    if (this.validarCompleta()) {
      this.gravar('publicada');
    }
  }

  /** Formações já publicadas ou arquivadas: guarda mantendo o estado. */
  guardarAlteracoes(): void {
    if (this.validarCompleta()) {
      this.gravar(this.estadoEditado() ?? 'rascunho');
    }
  }

  cancelar(): void {
    if (this.form.dirty && !window.confirm('Descartar as alterações feitas?')) {
      return;
    }
    this.fecharEditor();
  }

  private validarCompleta(): boolean {
    const naoOk = this.verificacoes(this.lerFormulario()).filter(v => !v.ok).map(v => v.texto);
    this.faltas.set(naoOk);

    if (naoOk.length > 0) {
      this.form.markAllAsTouched();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  }

  private gravar(estado: EstadoFormacao): void {
    const dados = this.lerFormulario();
    const agora = new Date().toISOString();
    const id = this.editandoId();

    if (id === null) {
      const nova: Formacao = { id: this.proximoId++, ...dados, estado, actualizadaEm: agora };
      this.formacoes.update(lista => [nova, ...lista]);
    } else {
      this.formacoes.update(lista =>
        lista.map(f => f.id === id ? { ...f, ...dados, estado, actualizadaEm: agora } : f)
      );
    }

    const acao = estado === 'rascunho' ? 'guardado como rascunho' : estado === 'publicada' ? 'publicada' : 'actualizada';
    this.mensagem.set({ tipo: 'sucesso', texto: `A formação "${dados.titulo}" foi ${acao}.` });
    this.fecharEditor();
  }

  private fecharEditor(): void {
    this.vista.set('lista');
    this.faltas.set([]);
    window.scrollTo({ top: 0 });
  }

  // ===================================================================
  //  7. EDITOR: LISTAS E MÓDULOS
  // ===================================================================

  adicionarItem(lista: FormArray): void {
    lista.push(this.fb.control(''));
  }

  removerItem(lista: FormArray, indice: number): void {
    lista.removeAt(indice);
    if (lista.length === 0) {
      lista.push(this.fb.control(''));
    }
  }

  adicionarModulo(): void {
    this.modulosArr.push(this.novoModulo({ titulo: '', aulas: [] }));
  }

  removerModulo(indice: number): void {
    this.modulosArr.removeAt(indice);
  }

  adicionarAula(indiceModulo: number): void {
    this.aulasDe(indiceModulo).push(this.novaAula());
  }

  removerAula(indiceModulo: number, indiceAula: number): void {
    this.aulasDe(indiceModulo).removeAt(indiceAula);
  }

  /** "12 aulas • 1h 12min", como na página pública. */
  resumoModulo(modulo: AbstractControl): string {
    const aulas = (modulo.get('aulas') as FormArray).controls;
    const segundos = aulas.reduce(
      (total, a) => total + this.segundos((a.get('duracao')?.value ?? '').trim()), 0
    );
    const n = aulas.length;
    return `${n} ${n === 1 ? 'aula' : 'aulas'} • ${this.formatarDuracao(segundos)}`;
  }

  private novoModulo(m: Modulo): FormGroup {
    const aulas = m.aulas.length ? m.aulas : [undefined];
    return this.fb.group({
      titulo: [m.titulo],
      aulas: this.fb.array(aulas.map(a => this.novaAula(a)))
    });
  }

  private novaAula(a?: Aula): FormGroup {
    return this.fb.group({
      nome: [a?.nome ?? ''],
      tipo: [a?.tipo ?? 'video'],
      duracao: [a?.duracao ?? '', [Validators.pattern(PADRAO_DURACAO)]],
      preview: [a?.preview ?? false]
    });
  }

  // ===================================================================
  //  8. EDITOR: PASSAR DOS DADOS AO FORMULÁRIO E VICE-VERSA
  // ===================================================================

  /** Preenche o formulário com uma formação (ou deixa-o em branco). */
  private preencher(f: DadosFormacao | null): void {
    this.form.reset({
      titulo: f?.titulo ?? '',
      subtitulo: f?.subtitulo ?? '',
      area: f?.area ?? '',
      subarea: f?.subarea ?? '',
      topico: f?.topico ?? '',
      idioma: f?.idioma ?? 'Português',
      imagem: f?.imagem ?? '',
      descricao: f?.descricao ?? '',
      topicos: f ? f.topicos.join(', ') : '',
      preco: f?.preco ?? null,
      incluidaSubscricao: f?.incluidaSubscricao ?? false,
      formador: f?.formador ?? '',
      formadorBio: f?.formadorBio ?? ''
    });

    this.reconstruir(this.aprenderArr, f?.aprender ?? []);
    this.reconstruir(this.incluiArr, f?.inclui ?? []);
    this.reconstruir(this.requisitosArr, f?.requisitos ?? []);

    this.modulosArr.clear();
    const modulos = f && f.modulos.length ? f.modulos : [{ titulo: '', aulas: [] }];
    modulos.forEach(m => this.modulosArr.push(this.novoModulo(m)));

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.actualizarResumo();
  }

  private reconstruir(lista: FormArray, valores: string[]): void {
    lista.clear();
    (valores.length ? valores : ['']).forEach(v => lista.push(this.fb.control(v)));
  }

  /** Lê o formulário, tirando espaços e linhas vazias. */
  private lerFormulario(): DadosFormacao {
    const v = this.form.getRawValue();
    const limpar = (lista: (string | null)[]) =>
      lista.map(t => (t ?? '').trim()).filter(t => t.length > 0);

    const modulos: Modulo[] = (v.modulos as any[])
      .map(m => ({
        titulo: (m.titulo ?? '').trim(),
        aulas: (m.aulas as any[])
          .map(a => ({
            nome: (a.nome ?? '').trim(),
            tipo: a.tipo as TipoAula,
            duracao: (a.duracao ?? '').trim(),
            preview: !!a.preview
          }))
          .filter(a => a.nome.length > 0)
      }))
      .filter(m => m.titulo.length > 0 || m.aulas.length > 0);

    const preco = v.preco === null || v.preco === '' ? null : Number(v.preco);

    return {
      titulo: (v.titulo ?? '').trim(),
      subtitulo: (v.subtitulo ?? '').trim(),
      area: v.area ?? '',
      subarea: (v.subarea ?? '').trim(),
      topico: (v.topico ?? '').trim(),
      idioma: v.idioma ?? 'Português',
      imagem: (v.imagem ?? '').trim(),
      aprender: limpar(v.aprender),
      inclui: limpar(v.inclui),
      modulos,
      requisitos: limpar(v.requisitos),
      descricao: (v.descricao ?? '').trim(),
      topicos: limpar(String(v.topicos ?? '').split(',')),
      preco: preco === null || Number.isNaN(preco) ? null : preco,
      incluidaSubscricao: !!v.incluidaSubscricao,
      formador: (v.formador ?? '').trim(),
      formadorBio: (v.formadorBio ?? '').trim()
    };
  }

  // ===================================================================
  //  9. REGRAS PARA PUBLICAR  (uma só fonte: lista de verificação + faltas)
  // ===================================================================

  private verificacoes(d: DadosFormacao): Verificacao[] {
    const aulas = d.modulos.flatMap(m => m.aulas);

    return [
      { texto: 'Título com pelo menos 5 caracteres', ok: d.titulo.length >= 5 },
      { texto: 'Área escolhida', ok: !!d.area },
      { texto: `Descrição com pelo menos ${MIN_DESCRICAO} caracteres`, ok: d.descricao.length >= MIN_DESCRICAO },
      { texto: `Pelo menos ${MIN_OBJECTIVOS} objectivo de aprendizagem`, ok: d.aprender.length >= MIN_OBJECTIVOS },
      { texto: 'Pelo menos uma aula no conteúdo programático', ok: aulas.length > 0 },
      { texto: 'Todos os módulos com título', ok: d.modulos.every(m => !!m.titulo) },
      { texto: 'Durações das aulas no formato mm:ss', ok: aulas.every(a => !a.duracao || PADRAO_DURACAO.test(a.duracao)) },
      { texto: 'Preço indicado (ou incluída na subscrição)', ok: d.incluidaSubscricao || (d.preco !== null && d.preco >= 0) },
      { texto: 'Formador indicado', ok: !!d.formador }
    ];
  }

  private actualizarResumo(): void {
    const d = this.lerFormulario();
    const aulas = d.modulos.flatMap(m => m.aulas);
    const segundos = aulas.reduce((total, a) => total + this.segundos(a.duracao), 0);

    this.resumo.set({
      modulos: d.modulos.length,
      aulas: aulas.length,
      duracao: this.formatarDuracao(segundos),
      verificacoes: this.verificacoes(d)
    });
  }

  // ===================================================================
  //  10. TEXTOS E FORMATOS
  // ===================================================================

  estadoTexto(estado: EstadoFormacao): string {
    return { rascunho: 'Rascunho', publicada: 'Publicada', arquivada: 'Arquivada' }[estado];
  }

  estadoClasse(estado: EstadoFormacao): string {
    return { rascunho: 'bg-secondary', publicada: 'bg-success', arquivada: 'bg-dark' }[estado];
  }

  textoPreco(f: Formacao): string {
    if (f.preco === null) {
      return f.incluidaSubscricao ? 'Subscrição' : '—';
    }
    return `${this.formatarKz(f.preco)} Kz`;
  }

  /** 85990 -> "85.990" */
  formatarKz(valor: number): string {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private segundos(duracao: string): number {
    if (!PADRAO_DURACAO.test(duracao)) {
      return 0;
    }
    const p = duracao.split(':').map(Number);
    return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
  }

  private formatarDuracao(segundos: number): string {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }

  // ===================================================================
  //  11. DADOS DE EXEMPLO
  // ===================================================================

  private exemplos(): Formacao[] {
    return [
      {
        id: 1,
        titulo: '100 Dias de Código: O Bootcamp Completo de Python Pro',
        subtitulo: 'Domina Python construindo 100 projectos em 100 dias.',
        area: 'Desenvolvimento',
        subarea: 'Linguagens de Programação',
        topico: 'Python',
        idioma: 'Português',
        imagem: '',
        aprender: [
          'Dominar a linguagem Python construindo 100 projectos únicos em 100 dias.',
          'Automação, jogos, desenvolvimento web e ciência de dados com Python.',
          'Construir um portefólio sólido para te candidatares a vagas de programação.'
        ],
        inclui: ['52 horas de vídeo sob demanda', '23 exercícios práticos', 'Certificado de conclusão'],
        modulos: [{
          titulo: 'Dia 1 - Iniciante - Trabalhar com Variáveis',
          aulas: [
            { nome: 'O que vais tirar desta formação', tipo: 'video', duracao: '3:27', preview: true },
            { nome: 'Imprimir na Consola em Python', tipo: 'video', duracao: '11:25', preview: false },
            { nome: 'Quiz: Nomear Variáveis', tipo: 'quiz', duracao: '', preview: false }
          ]
        }],
        requisitos: ['Não é necessária experiência em programação', 'Um computador com acesso à internet'],
        descricao: 'Bem-vindo aos 100 Dias de Código. Esta formação leva-te de iniciante a profissional, ensinando-te a programar em Python com projectos reais, boas práticas e código limpo.',
        topicos: ['Python', 'Ciência de Dados', 'Flask'],
        preco: 85990,
        incluidaSubscricao: true,
        formador: 'Ângela Silva',
        formadorBio: 'Programadora e formadora com paixão pelo ensino.',
        estado: 'publicada',
        actualizadaEm: '2026-06-12T10:00:00'
      },
      {
        id: 2,
        titulo: 'Excel para Negócios',
        subtitulo: '',
        area: 'Negócios',
        subarea: '',
        topico: '',
        idioma: 'Português',
        imagem: '',
        aprender: [],
        inclui: [],
        modulos: [],
        requisitos: [],
        descricao: '',
        topicos: [],
        preco: null,
        incluidaSubscricao: false,
        formador: '',
        formadorBio: '',
        estado: 'rascunho',
        actualizadaEm: '2026-09-30T15:30:00'
      },
      {
        id: 3,
        titulo: 'Gestão de Projectos com Scrum',
        subtitulo: 'Planeia, executa e entrega projectos com métodos ágeis.',
        area: 'Negócios',
        subarea: 'Gestão',
        topico: 'Scrum',
        idioma: 'Português',
        imagem: '',
        aprender: ['Conduzir cerimónias Scrum', 'Gerir um backlog de produto'],
        inclui: ['12 horas de vídeo sob demanda'],
        modulos: [{
          titulo: 'Introdução ao Scrum',
          aulas: [{ nome: 'Papéis e responsabilidades', tipo: 'video', duracao: '8:10', preview: false }]
        }],
        requisitos: [],
        descricao: 'Aprende a aplicar o Scrum em equipas reais, com exemplos práticos do mercado angolano e exercícios de planeamento de sprints do início ao fim.',
        topicos: ['Scrum', 'Agile'],
        preco: 25000,
        incluidaSubscricao: false,
        formador: 'Paulo Mendes',
        formadorBio: '',
        estado: 'arquivada',
        actualizadaEm: '2026-03-02T09:15:00'
      }
    ];
  }
}
