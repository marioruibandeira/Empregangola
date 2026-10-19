import { Component, OnInit, computed, signal } from '@angular/core';
// Layout
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
  templateUrl: './vagas-destaques.component.html',
  styleUrl: './vagas-destaques.component.css',
})

export class VagasDestaquesComponent {

}
