import { Component, signal, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';
import { AuthService } from '../../auth/auth.service';
import { TodosUtilizadoresService } from '../../services/administracao/todos-utilizadores.service';
import { TodosUtilizadoresDTO } from '../../services/administracao/todos-utilizadores.service.dto';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FuncionarioDosUtilizadores } from '../../services/administracao/funcionario-dos-utilizadores.service';
import { SucessoUFuncionarioComponent } from '../../modals/sucesso-u-funcionario/sucesso-u-funcionario.component';

@Component({
  selector: 'app-utilizadores',
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent,
    CommonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SucessoUFuncionarioComponent
  ],
  templateUrl: './utilizadores.component.html',
  styleUrl: './utilizadores.component.css',
})
export class UtilizadoresComponent implements OnInit {

  floatLabelControl = new FormControl('auto' as 'always' | 'never' | 'auto');

  utilizadores = signal<TodosUtilizadoresDTO[]>([]);
  aCarregar = signal(true);
  erro = signal(false);

  @ViewChild('fecharAdd') fecharAdd!: ElementRef<HTMLButtonElement>;
  resultadoAberto = signal(false);

  constructor(
    private todosUtilizadoresService: TodosUtilizadoresService,
    private authService: AuthService,
    private funcionarioService: FuncionarioDosUtilizadores
  ) { }

  ngOnInit():void{
    this.carregarTodosUtilizadores();
  }

  carregarTodosUtilizadores(): void
  {
    this.todosUtilizadoresService.getAllUsers().subscribe({
      next: (res) => {

        console.log("O que a API devolveu:", res);
        //this.utilizadores = res;
        this.utilizadores.set(res);
        this.erro.set(false);
        this.aCarregar.set(false);
      },
      error: (err) =>{
        console.error("Erro ao carregar dados:", err);
        this.erro.set(true);
        this.aCarregar.set(false);
      }
    });
  }

  //
  selectedUser = signal<TodosUtilizadoresDTO | null>(null);
  confirmado = signal(false);
  resultadoTipo = signal<'sucesso' | 'erro'>('sucesso');
  resultadoMensagem = signal('');

  selecionar(u: TodosUtilizadoresDTO): void {
    this.selectedUser.set(u);
    this.confirmado.set(false);
  }

  onConfirmar(event: MatCheckboxChange): void {
    this.confirmado.set(event.checked);
  }

  guardar(): void {
    const user = this.selectedUser();

    if (!user || !this.confirmado()) return;

    const dados = { appUserId: user.appUserId };

    this.funcionarioService.guardarUtilizadorComoFuncionario(dados).subscribe({
      next: (res) => {
        this.abrirResultado('sucesso', 'O utilizador foi adicionado como funcionário.');
        console.log('Funcionário criado:', res);
      },
      error: (err) => {
        console.error('Erro ao guardar:', err);

        const mensagem =
          err.error?.message ??
          (typeof err.error === 'string' ? err.error : null) ??
          'Não foi possível guardar. Tente novamente.';

        this.abrirResultado('erro', mensagem);
      }
    });
  }

  private abrirResultado(tipo: 'sucesso' | 'erro', mensagem: string): void {
    this.resultadoTipo.set(tipo);
    this.resultadoMensagem.set(mensagem);

    this.fecharAdd?.nativeElement.click();   // fecha o modal "Adicionar Funcionário"
    this.resultadoAberto.set(true);
  }

  fecharResultado(): void {
    this.resultadoAberto.set(false);
  }
}
