import { Component } from '@angular/core';
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

@Component({
  selector: 'app-novas-vagas',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './novas-vagas.component.html',
  styleUrl: './novas-vagas.component.css',
})
export class NovasVagasComponent {

}
