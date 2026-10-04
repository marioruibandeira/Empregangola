import { Component } from '@angular/core';
import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';

@Component({
  selector: 'app-v-verificados',
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './v-verificados.component.html',
  styleUrl: './v-verificados.component.css',
})
export class VVerificadosComponent {

}
