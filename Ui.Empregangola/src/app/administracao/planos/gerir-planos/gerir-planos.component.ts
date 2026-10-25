// =====================================================================
//  GerirPlanosComponent
//  Página de administração para gerir os planos de destaque que as
//  empresas podem escolher (a página que as empresas vêem é a
//  PlanosComponent, em empresa/planos).
//    - LISTA:       ordenar, destacar o "mais escolhido", activar/desactivar, eliminar
//    - FORMULÁRIO:  criar e editar um plano, com pré-visualização do cartão
//
//  Rota:  administracao/planos
//
//  ATENÇÃO: por agora os dados ficam em memória (perdem-se ao recarregar
//  a página) e os três planos iniciais são EXEMPLOS. Quando existir
//  backend, troca-se o signal `planos` por chamadas à API. Convém então
//  pôr o modelo `Plano` num ficheiro partilhado com a PlanosComponent.
// =====================================================================

import { Component, computed, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

// ---------------------------------------------------------------------
//  Modelos
// ---------------------------------------------------------------------
export interface BeneficioPlano {
  texto: string;
  incluido: boolean;
}

export interface DadosPlano {
  nome: string;
  descricao: string;
  duracaoDias: number;
  preco: number;            // em Kz, por vaga
  recomendado: boolean;     // mostra a fita "Mais escolhido" (só um plano de cada vez)
  activo: boolean;          // só os activos aparecem às empresas
  beneficios: BeneficioPlano[];
}

export interface Plano extends DadosPlano {
  id: number;
}

/** O que o formulário lê: os números podem estar por preencher. */
type LeituraPlano = Omit<DadosPlano, 'preco' | 'duracaoDias'> & {
  preco: number | null;
  duracaoDias: number | null;
};

/** Benefícios que um plano novo traz já escritos (todos por marcar). */
const BENEFICIOS_PADRAO = [
  'Selo "Destaque" na lista de vagas',
  'Posição prioritária nos resultados',
  'Presença em "Vagas em Destaque" na página inicial',
  'Partilha nas redes sociais',
  'Relatório de visualizações'
];

@Component({
  selector: 'app-gerir-planos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './gerir-planos.component.html',
  styleUrl: './gerir-planos.component.css',
})
export class GerirPlanosComponent {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  /** Que ecrã está visível. */
  vista = signal<'lista' | 'formulario'>('lista');

  /** Os planos, pela ordem em que aparecem às empresas (em memória, por agora). */
  planos = signal<Plano[]>(this.exemplos());
  private proximoId = 100;

  activos = computed(() => this.planos().filter(p => p.activo).length);

  /** Mensagem de sucesso ou erro, no topo da página. */
  mensagem = signal<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  /** Plano com a confirmação de "eliminar" aberta. */
  eliminarId = signal<number | null>(null);

  // --- Formulário ---
  form: FormGroup;

  /** Id do plano em edição; null = plano novo. */
  editandoId = signal<number | null>(null);

  /** Erro que não pertence a um campo (por exemplo, sem benefícios). */
  erroForm = signal<string | null>(null);

  /** O plano tal como está no formulário, para a pré-visualização. */
  previsao = signal<LeituraPlano>(this.vazio());

  // ===================================================================
  //  2. CONSTRUTOR
  // ===================================================================

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), this.nomeUnico()]],
      descricao: ['', [Validators.maxLength(120)]],
      duracaoDias: [7, [Validators.required, Validators.min(1), Validators.max(365), Validators.pattern(/^\d+$/)]],
      preco: [null, [Validators.required, Validators.min(0)]],
      recomendado: [false],
      activo: [true],
      beneficios: this.fb.array([])
    });

    this.form.valueChanges.subscribe(() => this.previsao.set(this.lerFormulario()));
    this.preencher(null);
  }

  // ===================================================================
  //  3. GETTERS  (usados no template)
  // ===================================================================

  get nome() { return this.form.get('nome'); }
  get descricao() { return this.form.get('descricao'); }
  get duracaoDias() { return this.form.get('duracaoDias'); }
  get preco() { return this.form.get('preco'); }
  get beneficiosArr() { return this.form.get('beneficios') as FormArray; }

  // ===================================================================
  //  4. LISTA
  // ===================================================================

  novoPlano(): void {
    this.mensagem.set(null);
    this.editandoId.set(null);
    this.erroForm.set(null);
    this.preencher(null);
    this.vista.set('formulario');
  }

  editar(p: Plano): void {
    this.mensagem.set(null);
    this.editandoId.set(p.id);
    this.erroForm.set(null);
    this.preencher(p);
    this.vista.set('formulario');
  }

  /** Sobe (-1) ou desce (+1) o plano na ordem de apresentação. */
  mover(indice: number, delta: -1 | 1): void {
    const destino = indice + delta;
    const lista = [...this.planos()];

    if (destino < 0 || destino >= lista.length) {
      return;
    }

    [lista[indice], lista[destino]] = [lista[destino], lista[indice]];
    this.planos.set(lista);
  }

  alternarActivo(p: Plano): void {
    this.planos.update(lista => lista.map(x => x.id === p.id ? { ...x, activo: !x.activo } : x));
    this.mensagem.set({
      tipo: 'sucesso',
      texto: p.activo
        ? `O plano "${p.nome}" foi desactivado e já não aparece às empresas.`
        : `O plano "${p.nome}" foi activado.`
    });
  }

  /** Só um plano de cada vez tem a fita "Mais escolhido". */
  alternarRecomendado(p: Plano): void {
    const passaARecomendado = !p.recomendado;
    this.planos.update(lista => lista.map(x => ({ ...x, recomendado: passaARecomendado && x.id === p.id })));
  }

  pedirEliminar(id: number): void {
    this.eliminarId.set(id);
  }

  cancelarEliminar(): void {
    this.eliminarId.set(null);
  }

  eliminar(p: Plano): void {
    this.planos.update(lista => lista.filter(x => x.id !== p.id));
    this.eliminarId.set(null);
    this.mensagem.set({ tipo: 'sucesso', texto: `O plano "${p.nome}" foi eliminado.` });
  }

  // ===================================================================
  //  5. FORMULÁRIO: GUARDAR
  // ===================================================================

  guardar(): void {
    this.erroForm.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.lerFormulario();

    if (dados.beneficios.length === 0) {
      this.erroForm.set('Indique pelo menos um benefício.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const plano: DadosPlano = { ...dados, preco: dados.preco!, duracaoDias: dados.duracaoDias! };
    const idGravado = this.editandoId() ?? this.proximoId++;

    this.planos.update(lista => {
      const existe = lista.some(p => p.id === idGravado);
      const base = existe
        ? lista.map(p => p.id === idGravado ? { id: idGravado, ...plano } : p)
        : [...lista, { id: idGravado, ...plano }];

      // Se este plano passou a ser o "mais escolhido", os outros deixam de o ser
      return plano.recomendado
        ? base.map(p => ({ ...p, recomendado: p.id === idGravado }))
        : base;
    });

    this.mensagem.set({
      tipo: 'sucesso',
      texto: this.editandoId() === null
        ? `O plano "${plano.nome}" foi criado.`
        : `O plano "${plano.nome}" foi actualizado.`
    });
    this.fechar();
  }

  cancelar(): void {
    if (this.form.dirty && !window.confirm('Descartar as alterações feitas?')) {
      return;
    }
    this.fechar();
  }

  private fechar(): void {
    this.vista.set('lista');
    this.erroForm.set(null);
    window.scrollTo({ top: 0 });
  }

  // ===================================================================
  //  6. FORMULÁRIO: BENEFÍCIOS
  // ===================================================================

  adicionarBeneficio(): void {
    this.beneficiosArr.push(this.novoBeneficio());
  }

  removerBeneficio(indice: number): void {
    this.beneficiosArr.removeAt(indice);
  }

  private novoBeneficio(b?: BeneficioPlano): FormGroup {
    return this.fb.group({
      texto: [b?.texto ?? '', [Validators.maxLength(80)]],
      incluido: [b?.incluido ?? false]
    });
  }

  // ===================================================================
  //  7. FORMULÁRIO: PASSAR DOS DADOS AO FORMULÁRIO E VICE-VERSA
  // ===================================================================

  /** Preenche o formulário com um plano (ou deixa-o em branco, com os benefícios padrão). */
  private preencher(p: DadosPlano | null): void {
    this.form.reset({
      nome: p?.nome ?? '',
      descricao: p?.descricao ?? '',
      duracaoDias: p?.duracaoDias ?? 7,
      preco: p?.preco ?? null,
      recomendado: p?.recomendado ?? false,
      activo: p?.activo ?? true
    });

    this.beneficiosArr.clear();
    const beneficios = p
      ? p.beneficios
      : BENEFICIOS_PADRAO.map(texto => ({ texto, incluido: false }));
    beneficios.forEach(b => this.beneficiosArr.push(this.novoBeneficio(b)));

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.previsao.set(this.lerFormulario());
  }

  /** Lê o formulário, tirando espaços e benefícios vazios. */
  private lerFormulario(): LeituraPlano {
    const v = this.form.getRawValue();

    const numero = (valor: unknown): number | null => {
      if (valor === null || valor === '') {
        return null;
      }
      const n = Number(valor);
      return Number.isNaN(n) ? null : n;
    };

    return {
      nome: (v.nome ?? '').trim(),
      descricao: (v.descricao ?? '').trim(),
      duracaoDias: numero(v.duracaoDias),
      preco: numero(v.preco),
      recomendado: !!v.recomendado,
      activo: !!v.activo,
      beneficios: (v.beneficios as any[])
        .map(b => ({ texto: (b.texto ?? '').trim(), incluido: !!b.incluido }))
        .filter(b => b.texto.length > 0)
    };
  }

  /** O nome não pode repetir o de outro plano. */
  private nomeUnico(): ValidatorFn {
    return (controlo: AbstractControl): ValidationErrors | null => {
      const nome = String(controlo.value ?? '').trim().toLowerCase();
      if (!nome) {
        return null;
      }

      const idEditado = this.editandoId();
      const repetido = this.planos().some(
        p => p.id !== idEditado && p.nome.trim().toLowerCase() === nome
      );

      return repetido ? { duplicado: true } : null;
    };
  }

  // ===================================================================
  //  8. TEXTOS E FORMATOS
  // ===================================================================

  textoBeneficios(p: Plano): string {
    const incluidos = p.beneficios.filter(b => b.incluido).length;
    return `${incluidos} de ${p.beneficios.length}`;
  }

  textoPreco(valor: number | null): string {
    return valor === null ? '—' : `${this.formatarKz(valor)} Kz`;
  }

  textoDuracao(p: LeituraPlano): string {
    if (!p.duracaoDias) {
      return '';
    }
    if (p.preco === null) {
      return `por ${p.duracaoDias} dias`;
    }
    return `por ${p.duracaoDias} dias · cerca de ${this.formatarKz(Math.round(p.preco / p.duracaoDias))} Kz por dia`;
  }

  /** 15000 -> "15.000" */
  formatarKz(valor: number): string {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // ===================================================================
  //  9. DADOS DE EXEMPLO
  // ===================================================================

  private vazio(): LeituraPlano {
    return {
      nome: '', descricao: '', duracaoDias: null, preco: null,
      recomendado: false, activo: true, beneficios: []
    };
  }

  private exemplos(): Plano[] {
    const beneficios = (...incluidos: boolean[]): BeneficioPlano[] =>
      BENEFICIOS_PADRAO.map((texto, i) => ({ texto, incluido: incluidos[i] }));

    return [
      {
        id: 1,
        nome: 'Essencial',
        descricao: 'Para vagas que precisam de um empurrão.',
        duracaoDias: 7,
        preco: 15000,
        recomendado: false,
        activo: true,
        beneficios: beneficios(true, false, false, false, false)
      },
      {
        id: 2,
        nome: 'Profissional',
        descricao: 'O equilíbrio entre alcance e custo.',
        duracaoDias: 15,
        preco: 35000,
        recomendado: true,
        activo: true,
        beneficios: beneficios(true, true, true, false, false)
      },
      {
        id: 3,
        nome: 'Premium',
        descricao: 'Máxima visibilidade para as vagas mais urgentes.',
        duracaoDias: 30,
        preco: 60000,
        recomendado: false,
        activo: true,
        beneficios: beneficios(true, true, true, true, true)
      }
    ];
  }
}
