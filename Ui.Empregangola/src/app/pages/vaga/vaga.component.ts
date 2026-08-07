import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-vaga',
  standalone: true,
  imports : [
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './vaga.component.html',
  styleUrl: './vaga.component.css',
})
export class VagaComponent {

}
