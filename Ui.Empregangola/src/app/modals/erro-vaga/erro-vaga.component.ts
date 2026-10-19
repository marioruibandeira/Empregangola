import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ErrorVagaData {
  titulo: string;
  mensagens: string[];
}

@Component({
  selector: 'app-success-utilizador',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './erro-vaga.component.html',
  styleUrl: './erro-vaga.component.css',
})
export class ErroVagaComponent {
  data = inject<ErrorVagaData>(MAT_DIALOG_DATA);
}
