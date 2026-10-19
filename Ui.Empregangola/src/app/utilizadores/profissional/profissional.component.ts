import { Component } from '@angular/core';
import { BesidebarComponent } from '../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../shared/befooter/befooter.component';

@Component({
  selector: 'app-profissional',
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent 
  ],
  templateUrl: './profissional.component.html',
  styleUrl: './profissional.component.css',
})
export class ProfissionalComponent {

}
