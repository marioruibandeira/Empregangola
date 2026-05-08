import { Component, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service'; // Confirma se este caminho está certo
import { Router } from '@angular/router';

@Component({
  selector: 'app-header', // MUDOU: Agora é o seletor do header
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent { // MUDOU: O nome da classe deve ser HeaderComponent
  private authService = inject(AuthService);
  private router = inject(Router);
  private eRef = inject(ElementRef);

  isLogged = this.authService.isLogged;
  isMenuOpen = signal(false);

  toggleMenu(event: Event) {
    if (!this.isLogged()) {
      this.router.navigate(['/login']); // Geralmente redirecionamos para login
      return;
    }
    event.stopPropagation();
    this.isMenuOpen.update(val => !val);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (this.isMenuOpen()) {
      if (!this.eRef.nativeElement.contains(event.target)) {
        this.isMenuOpen.set(false);
      }
    }
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen.set(false); // Fecha o menu ao sair
    this.router.navigate(['/']); 
  }
}
