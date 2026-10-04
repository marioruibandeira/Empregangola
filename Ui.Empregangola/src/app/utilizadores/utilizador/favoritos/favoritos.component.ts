import { Component } from '@angular/core';
import { BesidebarComponent } from '../../../shared/besidebar/besidebar.component';
import { BeheaderComponent } from '../../../shared/beheader/beheader.component';
import { BefooterComponent } from '../../../shared/befooter/befooter.component';

@Component({
  selector: 'app-favoritos',
  imports: [
    BesidebarComponent,
    BeheaderComponent,
    BefooterComponent
  ],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css',
})
export class FavoritosComponent {

}
