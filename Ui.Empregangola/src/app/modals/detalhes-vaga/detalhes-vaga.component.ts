import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  NovasVagasService,
  VagaDetalheDTO
} from '../../services/empresa/novas-vagas/novas-vagas.service';

export interface DetalhesVagaData {
  vacanciesId: number;
}

@Component({
  selector: 'app-detalhes-vaga',
  standalone: true,
  imports: [MatDialogModule, DatePipe],
  templateUrl: './detalhes-vaga.component.html',
  styleUrl: './detalhes-vaga.component.css',
})
export class DetalhesVagaComponent implements OnInit {
  private data = inject<DetalhesVagaData>(MAT_DIALOG_DATA);
  private service = inject(NovasVagasService);
  private dialogRef = inject<MatDialogRef<DetalhesVagaComponent, string>>(MatDialogRef);

  vaga = signal<VagaDetalheDTO | null>(null);
  aCarregar = signal(true);
  erro = signal(false);

  // Fluxo de publicação
  confirmar = signal(false);
  aPublicar = signal(false);
  erroPublicar = signal<string | null>(null);

  // ---------- Tradução dos enums (iguais aos do backend) ----------
  private readonly contratos: Record<number, string> = {
    1: 'Efectivo', 2: 'Prazo certo', 3: 'Estágio', 4: 'Freelance'
  };

  private readonly modalidades: Record<number, string> = {
    1: 'Presencial', 2: 'Híbrido', 3: 'Remoto'
  };

  private readonly escolaridades: Record<number, string> = {
    0: 'Indiferente',
    1: '7º / 8º Classe',
    2: '9º / 10º Classe',
    3: '11º / 13º Classe',
    4: 'Médio',
    5: 'Bacharel',
    6: 'Licenciatura ou equivalente',
    7: 'Mestrado',
    8: 'Doutoramento'
  };

  private readonly experiencias: Record<number, string> = {
    0: 'Sem experiência',
    1: '1 ano',
    2: '2 a 3 anos',
    3: '4 a 5 anos',
    4: 'Mais de 5 anos'
  };

  private readonly candidaturas: Record<number, string> = {
    1: 'Na plataforma', 2: 'Por email', 3: 'Link externo'
  };

  private readonly estados: Record<number, string> = {
    1: 'Rascunho', 2: 'Aberta', 3: 'Publicada', 4: 'Encerrada'
  };

  private readonly classesEstado: Record<number, string> = {
    1: 'bg-secondary',
    2: 'bg-warning text-dark',
    3: 'bg-success',
    4: 'bg-danger'
  };

  ngOnInit(): void {
    this.service.getVagaPorId(this.data.vacanciesId).subscribe({
      next: (v) => {
        this.vaga.set(v);
        this.aCarregar.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar os detalhes da vaga:', err);
        this.erro.set(true);
        this.aCarregar.set(false);
      }
    });
  }

  contrato(v: VagaDetalheDTO): string { return this.contratos[v.contractType] ?? '—'; }
  modalidade(v: VagaDetalheDTO): string { return this.modalidades[v.workMode] ?? '—'; }
  escolaridade(v: VagaDetalheDTO): string { return this.escolaridades[v.educationLevel] ?? '—'; }
  experiencia(v: VagaDetalheDTO): string { return this.experiencias[v.experienceLevel] ?? '—'; }
  candidatura(v: VagaDetalheDTO): string { return this.candidaturas[v.applicationMethod] ?? '—'; }
  estado(v: VagaDetalheDTO): string { return this.estados[v.status] ?? 'Desconhecido'; }
  estadoClasse(v: VagaDetalheDTO): string { return this.classesEstado[v.status] ?? 'bg-light text-dark'; }

  // Só as vagas em aberto (2) se podem publicar
  podePublicar(v: VagaDetalheDTO): boolean {
    return v.status === 2;
  }

  publicar(v: VagaDetalheDTO): void {
    this.aPublicar.set(true);
    this.erroPublicar.set(null);

    this.service.publicarVaga(v.vacanciesId).subscribe({
      next: () => {
        this.aPublicar.set(false);
        // A lista usa este resultado para se recarregar
        this.dialogRef.close('publicada');
      },
      error: (err) => {
        console.error('Erro ao publicar a vaga:', err);
        this.aPublicar.set(false);
        this.confirmar.set(false);

        if (err.status === 401) {
          this.erroPublicar.set('A sessão expirou. Inicie sessão novamente.');
        } else {
          this.erroPublicar.set(
            err.error?.message ?? 'Não foi possível publicar a vaga. Tente novamente.'
          );
        }
      }
    });
  }

  // O destino só faz sentido para email (2) e link externo (3)
  temDestino(v: VagaDetalheDTO): boolean {
    return (v.applicationMethod === 2 || v.applicationMethod === 3) && !!v.applicationTarget;
  }

  salario(v: VagaDetalheDTO): string {
    if (v.negotiableSalary) {
      return 'A combinar';
    }

    const formatar = (n: number) => n.toLocaleString('pt-PT');

    if (v.salaryMin != null && v.salaryMax != null) {
      return `${formatar(v.salaryMin)} – ${formatar(v.salaryMax)} Kz`;
    }
    if (v.salaryMin != null) {
      return `A partir de ${formatar(v.salaryMin)} Kz`;
    }
    if (v.salaryMax != null) {
      return `Até ${formatar(v.salaryMax)} Kz`;
    }
    return 'Não indicado';
  }
}
