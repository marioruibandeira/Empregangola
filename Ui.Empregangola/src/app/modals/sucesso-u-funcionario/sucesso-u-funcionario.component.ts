import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sucesso-u-funcionario',
  standalone: true,
  templateUrl: './sucesso-u-funcionario.component.html',
  styleUrl: './sucesso-u-funcionario.component.css',
})
export class SucessoUFuncionarioComponent {
  aberto = input(false);
  tipo = input<'sucesso' | 'erro'>('sucesso');
  mensagem = input('');
  fechar = output<void>();
}
