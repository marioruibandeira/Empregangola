import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-success-utilizador',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './success-utilizador.component.html',
  styleUrl: './success-utilizador.component.css',
})
export class SuccessUtilizadorComponent {

}
