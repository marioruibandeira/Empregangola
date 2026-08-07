import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  templateUrl: './vagas.component.html',
  styleUrl: './vagas.component.css',
})
export class VagasComponent {

  pesquisaForm : FormGroup;

  constructor(private fb: FormBuilder){
    this.pesquisaForm = this.fb.group({
      palavraChave: [''],
      localizacao: [''],
      area: [''],
      tipoContrato: ['']
   } );
  }

  pesquisarVagas(): void {
    console.log('Critérios de pesquisa:', this.pesquisaForm.value);
  }


}
