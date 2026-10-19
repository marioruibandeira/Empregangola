import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface SuccessVagaData {
  titulo: string;
  edicao?: boolean;
  rascunho?: boolean;
}

@Component({
  selector: 'app-success-vaga',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './success-vaga.component.html',
  styleUrl: './success-vaga.component.css',
})
export class SuccessVagaComponent {
  data = inject<SuccessVagaData>(MAT_DIALOG_DATA);
}
