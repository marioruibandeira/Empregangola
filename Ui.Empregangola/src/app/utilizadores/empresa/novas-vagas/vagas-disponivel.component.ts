import { Component, OnInit, signal, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';
import { AuthService } from '../../../auth/auth.service';
import { NovasVagasService, VagaListaDTO } from '../../../services/empresa/novas-vagas/novas-vagas.service';
import { DetalhesVagaComponent } from '../../../modals/detalhes-vaga/detalhes-vaga.component';
import { MatDialog } from '@angular/material/dialog';
import {
  AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vagas-disponivel',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent,
    DatePipe,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './vagas-disponivel.component.html',
  styleUrls: ['./vagas-disponivel.component.css']
})

export class VagasDisponivelComponent implements OnInit {
  vagas = signal<VagaListaDTO[]>([]);
  aCarregar = signal(true);
  erro = signal(false);

  constructor(
    private authService: AuthService,
    private novasVagasService: NovasVagasService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.carregarVagas();
    this.carregarCabecalho();
  }

  private carregarVagas(): void {
    this.novasVagasService.getMinhasVagas().subscribe({
      next: (dados) => {
        this.vagas.set(dados);
        this.aCarregar.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar vagas:', err);
        this.erro.set(true);
        this.aCarregar.set(false);
      }
    });
  }

  verDetalhes(id: number): void {
    this.dialog
      .open(DetalhesVagaComponent, {
        width: '800px',
        maxWidth: '95vw',
        autoFocus: false,
        data: { vacanciesId: id }
      })
      .afterClosed()
      .subscribe(resultado => {
        if (resultado === 'publicada') {
          this.carregarVagas();
        }
      });
  }

  estadoTexto(status: number): string {
    switch (status) {
      case 1: return 'Rascunho';
      case 2: return 'Aberta';
      case 3: return 'Publicada';
      case 4: return 'Encerrada';
      default: return 'Desconhecido';
    }
  }

  estadoClasse(status: number): string {
    switch (status) {
      case 1: return 'bg-secondary';
      case 2: return 'bg-warning text-dark';
      case 3: return 'bg-success';
      case 4: return 'bg-danger';
      default: return 'bg-light text-dark';
    }
  }



  //
  //
  //
  painelAberto = signal(false);
  vagaSeleccionada = signal<VagaListaDTO | null>(null);

  abrirPainel(v: VagaListaDTO): void {
    this.vagaSeleccionada.set(v);
    this.painelAberto.set(true);
  }

  fecharPainel(): void {
    // a vaga fica guardada para o conteúdo não desaparecer durante o slide de saída
    this.painelAberto.set(false);
  }

  @HostListener('document:keydown.escape')
  aoPremirEscape(): void {
    if (this.painelAberto()) {
      this.fecharPainel();
    }
  }


  //
  //Cabecalho
  //
  cabecalho = new FormGroup({
    empresa: new FormControl(''),
    utilizador: new FormControl(''),
    ultimoLog: new FormControl('')
  });

  private carregarCabecalho(): void {
    this.novasVagasService.getCabecalho().subscribe({
      next: (c) => this.cabecalho.patchValue({
        empresa: c.companyName,
        utilizador: c.userName,
        ultimoLog: c.lastLogin ? new Date(c.lastLogin).toLocaleString('pt-PT') : '—'
      }),
      error: (err) => console.error('Erro ao carregar o cabeçalho:', err)
    });
  }

}
