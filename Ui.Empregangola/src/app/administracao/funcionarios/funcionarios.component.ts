import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-funcionarios',
  imports: [
    FormsModule,
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.css',
})
export class FuncionariosComponent {
  modoNovo = false;
}
