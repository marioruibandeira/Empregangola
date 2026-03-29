import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private platformId = inject(PLATFORM_ID);

  // Signal reativo para o estado de login
  isLoggedIn = signal<boolean>(this.checkToken());

  private checkToken(): boolean
  {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Atualiza o estado para "true" após login bem-sucedido
  setLoggedIn(status: boolean) {
    this.isLoggedIn.set(status);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isLoggedIn.set(false);
  }
}

