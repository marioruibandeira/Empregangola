import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-beheader',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './beheader.component.html',
  styleUrl: './beheader.component.css',
})
export class BeheaderComponent {
  @Input() nomeUtilizador: string = 'Utilizador';
  @Input() emailUtilizador: string = '';
  @Input() notificacoes: number = 0;

  logout() {
    //
  }
}
