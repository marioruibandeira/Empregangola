// =====================================================================
//  PerfilCandidatoComponent
//  Apresenta o perfil do candidato de forma amigável e profissional,
//  a partir dos dados recolhidos no formulário do candidato.
//  Rota:  profissional/perfil
//
//  ATENÇÃO: por agora o perfil é um EXEMPLO escrito no código. Quando
//  existir backend, o signal `perfil` passa a ser preenchido pela API.
//
//  A foto não é recolhida aqui: o componente só a mostra (`foto`).
//  Sem foto, aparecem as iniciais do nome.
//
//  Esta é a vista do próprio candidato (mostra todos os dados). Ao mostrar
//  o perfil às empresas, convém esconder os dados sensíveis (data de
//  nascimento, género, contactos) conforme a `visibilidade` escolhida.
// =====================================================================

import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

// ---------------------------------------------------------------------
//  Modelos (espelham as secções do formulário do candidato)
// ---------------------------------------------------------------------
export interface ExperienciaProfissional {
  empresa: string;
  cargo: string;
  inicio: string;          // "2022-03" (ano-mês)
  fim: string | null;      // null = ainda trabalha lá
  funcoes: string;
  conquistas: string;      // uma conquista por linha
}

export interface FormacaoAcademica {
  nivel: string;
  curso: string;
  instituicao: string;
  anoConclusao: number | null;
}

export type Visibilidade = 'publico' | 'empresas' | 'privado';
export type EstadoPerfil = 'activo' | 'inactivo';

export interface PerfilCandidato {
  foto: string | null;

  // Dados pessoais
  nomeCompleto: string;
  dataNascimento: string;       // "1994-08-21"
  genero: string;
  nacionalidade: string;
  email: string;
  telefone: string;
  pais: string;
  provincia: string;
  municipio: string;

  // Perfil profissional
  titulo: string;
  bio: string;
  areaActuacao: string;
  nivelExperiencia: string;
  anosExperiencia: string;
  pretensaoSalarial: number | null;
  disponibilidade: string;
  tipoContrato: string;
  modalidade: string;
  mudancaLocalidade: boolean | null;

  // Formação, experiência e competências
  formacoes: FormacaoAcademica[];
  certificacoes: string[];
  experiencias: ExperienciaProfissional[];
  competenciasTecnicas: string[];
  competenciasComportamentais: string[];
  idiomas: string[];

  // Anexos e ligações
  cvNome: string | null;
  cvUrl: string | null;
  portfolio: string | null;
  linkedin: string | null;
  github: string | null;
  cartaApresentacao: string;

  // Estado do perfil
  visibilidade: Visibilidade;
  estado: EstadoPerfil;
  actualizadoEm: string;        // ISO 8601
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-perfil-candidato',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './perfil-candidato.component.html',
  styleUrl: './perfil-candidato.component.css',
})
export class PerfilCandidatoComponent {

  // ===================================================================
  //  1. ESTADO
  // ===================================================================

  /** Rota do formulário onde o candidato edita os dados (ajusta à tua). */
  readonly rotaEdicao = '/profissional/profissional';

  perfil = signal<PerfilCandidato>(this.exemplo());

  /** "Ana Beatriz Fernandes" -> "AF" (aparece quando não há foto). */
  iniciais = computed(() => {
    const partes = this.perfil().nomeCompleto.trim().split(/\s+/).filter(p => p.length > 0);
    if (partes.length === 0) {
      return '?';
    }
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primeira + ultima).toUpperCase();
  });

  /** "Talatona, Luanda, Angola" */
  localizacao = computed(() => {
    const p = this.perfil();
    return [p.municipio, p.provincia, p.pais].filter(t => t && t.trim()).join(', ');
  });

  /** Quanto do perfil está preenchido, e o que falta (as três primeiras dicas). */
  completude = computed(() => {
    const p = this.perfil();

    const verificacoes = [
      { texto: 'Adicione uma foto de perfil', ok: !!p.foto },
      { texto: 'Escreva um título profissional e uma apresentação', ok: !!p.titulo && p.bio.length >= 80 },
      { texto: 'Adicione pelo menos uma experiência profissional', ok: p.experiencias.length > 0 },
      { texto: 'Adicione a sua formação académica', ok: p.formacoes.length > 0 },
      { texto: 'Indique pelo menos 3 competências técnicas', ok: p.competenciasTecnicas.length >= 3 },
      { texto: 'Indique os idiomas que fala', ok: p.idiomas.length > 0 },
      { texto: 'Carregue o seu CV', ok: !!p.cvUrl },
      { texto: 'Adicione uma ligação (LinkedIn, GitHub ou portfólio)', ok: !!(p.linkedin || p.github || p.portfolio) },
      { texto: 'Indique um telefone de contacto', ok: !!p.telefone }
    ];

    const feitas = verificacoes.filter(v => v.ok).length;

    return {
      percentagem: Math.round((feitas / verificacoes.length) * 100),
      faltas: verificacoes.filter(v => !v.ok).map(v => v.texto).slice(0, 3)
    };
  });

  // ===================================================================
  //  2. ACÇÕES
  // ===================================================================

  /** Abre a janela de impressão (que também serve para guardar em PDF). */
  imprimir(): void {
    window.print();
  }

  // ===================================================================
  //  3. TEXTOS USADOS NO TEMPLATE
  // ===================================================================

  /** "Mar 2022 — Actual" */
  periodo(e: ExperienciaProfissional): string {
    const inicio = this.partes(e.inicio);
    const textoInicio = `${MESES[inicio.mes - 1]} ${inicio.ano}`;

    if (!e.fim) {
      return `${textoInicio} — Actual`;
    }

    const fim = this.partes(e.fim);
    return `${textoInicio} — ${MESES[fim.mes - 1]} ${fim.ano}`;
  }

  /** "2 anos e 3 meses" */
  duracao(e: ExperienciaProfissional): string {
    const inicio = this.partes(e.inicio);
    const agora = new Date();
    const fim = e.fim ? this.partes(e.fim) : { ano: agora.getFullYear(), mes: agora.getMonth() + 1 };

    const totalMeses = Math.max(1, (fim.ano - inicio.ano) * 12 + (fim.mes - inicio.mes) + 1);
    const anos = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;

    const partes: string[] = [];
    if (anos > 0) {
      partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
    }
    if (meses > 0) {
      partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
    }
    return partes.join(' e ');
  }

  /** Divide um texto em linhas (para mostrar conquistas em lista). */
  linhas(texto: string): string[] {
    return (texto ?? '').split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  }

  textoSimNao(valor: boolean | null): string {
    return valor === null ? '—' : valor ? 'Sim' : 'Não';
  }

  textoPretensao(valor: number | null): string {
    return valor === null ? '—' : `${this.formatarKz(valor)} Kz`;
  }

  textoVisibilidade(v: Visibilidade): string {
    return { publico: 'Público', empresas: 'Só empresas registadas', privado: 'Privado' }[v];
  }

  textoEstado(e: EstadoPerfil): string {
    return { activo: 'Activo', inactivo: 'Inactivo' }[e];
  }

  /** "+244 923 000 000" -> "tel:+244923000000" */
  ligacaoTelefone(telefone: string): string {
    return 'tel:' + telefone.replace(/\s+/g, '');
  }

  /** 80000 -> "80.000" */
  formatarKz(valor: number): string {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private partes(valor: string): { ano: number; mes: number } {
    const [ano, mes] = valor.split('-').map(Number);
    return { ano, mes };
  }

  // ===================================================================
  //  4. PERFIL DE EXEMPLO
  // ===================================================================

  private exemplo(): PerfilCandidato {
    return {
      foto: null,

      nomeCompleto: 'Ana Beatriz Fernandes',
      dataNascimento: '1994-08-21',
      genero: 'Feminino',
      nacionalidade: 'Angolana',
      email: 'ana.fernandes@exemplo.co.ao',
      telefone: '+244 923 000 000',
      pais: 'Angola',
      provincia: 'Luanda',
      municipio: 'Talatona',

      titulo: 'Engenheira de Software Full-Stack',
      bio: 'Engenheira de software com mais de 5 anos de experiência a construir aplicações web com .NET e Angular. '
         + 'Gosto de transformar problemas de negócio em soluções simples, testadas e fáceis de manter. '
         + 'Procuro uma equipa onde possa crescer em arquitectura e liderança técnica.',
      areaActuacao: 'Tecnologia',
      nivelExperiencia: 'Sénior',
      anosExperiencia: '3 a 5 anos',
      pretensaoSalarial: 650000,
      disponibilidade: 'Imediata',
      tipoContrato: 'Efectivo',
      modalidade: 'Híbrido',
      mudancaLocalidade: false,

      formacoes: [
        {
          nivel: 'Licenciatura',
          curso: 'Engenharia Informática',
          instituicao: 'Universidade Agostinho Neto',
          anoConclusao: 2017
        }
      ],
      certificacoes: [
        'Microsoft Certified: Azure Developer Associate',
        'Scrum Fundamentals Certified',
        'Angular Avançado (Centro de Formação Florescer do Amanhã)'
      ],

      experiencias: [
        {
          empresa: 'Cleva Solutions',
          cargo: 'Engenheira de Software Sénior',
          inicio: '2022-03',
          fim: null,
          funcoes: 'Desenho e desenvolvimento de APIs em .NET 8 com Clean Architecture e CQRS, e de interfaces em Angular. '
                 + 'Revisão de código e mentoria de dois programadores juniores.',
          conquistas: 'Reduziu o tempo de resposta das APIs principais em 40%.\n'
                    + 'Introduziu testes automatizados, subindo a cobertura de 20% para 75%.'
        },
        {
          empresa: 'Tech Hidráulico',
          cargo: 'Programadora Pleno',
          inicio: '2019-06',
          fim: '2022-02',
          funcoes: 'Manutenção e evolução do sistema de gestão interno, em C# e SQL Server.',
          conquistas: 'Automatizou a emissão de relatórios mensais, poupando cerca de 20 horas por mês.'
        },
        {
          empresa: 'Bee Engineering',
          cargo: 'Programadora Júnior',
          inicio: '2017-09',
          fim: '2019-05',
          funcoes: 'Desenvolvimento de componentes web e correcção de erros em aplicações de clientes.',
          conquistas: ''
        }
      ],

      competenciasTecnicas: ['C#', '.NET 8', 'Angular', 'TypeScript', 'SQL Server', 'Entity Framework', 'Azure', 'Git'],
      competenciasComportamentais: ['Comunicação', 'Trabalho em equipa', 'Resolução de problemas', 'Gestão do tempo'],
      idiomas: ['Português (nativo)', 'Inglês (avançado)', 'Francês (básico)'],

      cvNome: 'CV-Ana-Fernandes.pdf',
      cvUrl: '#',
      portfolio: 'https://exemplo.co.ao/ana',
      linkedin: 'https://www.linkedin.com/in/exemplo',
      github: 'https://github.com/exemplo',
      cartaApresentacao: '',

      visibilidade: 'empresas',
      estado: 'activo',
      actualizadoEm: '2026-10-18T09:30:00'
    };
  }
}
