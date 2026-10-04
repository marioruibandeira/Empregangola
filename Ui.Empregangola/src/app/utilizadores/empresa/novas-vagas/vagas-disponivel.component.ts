import { Component } from '@angular/core';
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-vagas-disponivel',
  standalone: true,
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './vagas-disponivel.component.html',
  styleUrls: ['./vagas-disponivel.component.css']
})
export class VagasDisponivelComponent {

  constructor(private authService: AuthService) {}

}
