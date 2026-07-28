import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports : [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './privacidade.component.html',
  styleUrl: './privacidade.component.css',
})
export class PrivacidadeComponent {

}
