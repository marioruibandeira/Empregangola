import { Component,
  Input,
  signal,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-beheader',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './beheader.component.html',
  styleUrl: './beheader.component.css',
})
export class BeheaderComponent {
  @Input() nomeUtilizador: string = 'Utilizador';
  @Input() emailUtilizador: string = '';
  @Input() notificacoes: number = 0;

  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}
