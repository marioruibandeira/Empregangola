import { Component } from '@angular/core';

import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';

@Component({
  selector: 'app-funcionarios',
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent,
  ],
  templateUrl: './funcionarios.component.html',
  styleUrl: './funcionarios.component.css',
})
export class FuncionariosComponent {

}
