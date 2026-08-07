import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-formacao-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './formacao-detalhes.component.html',
  styleUrl: './formacao-detalhes.component.css',
})
export class FormacaoDetalhesComponent {

}
