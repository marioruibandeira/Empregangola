import { Component } from '@angular/core';
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

@Component({
  selector: 'app-centro-formacao',
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './centro-formacao.component.html',
  styleUrl: './centro-formacao.component.css',
})
export class CentroFormacaoComponent {

}
