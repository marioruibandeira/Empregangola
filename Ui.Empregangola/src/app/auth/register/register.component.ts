import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthLayoutComponent } from '../layout/layout.component';
import { AuthService, RegisterRequest } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AuthLayoutComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onRegister() {

    if (this.loading) return;

    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.snackBar.open('Preenche todos os campos', 'Fechar', { duration: 4000 });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('As passwords não coincidem', 'Fechar', { duration: 4000 });
      return;
    }

    const data: RegisterRequest = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.loading = true;

    this.authService.register(data)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (response) => {
          this.snackBar.open(
            `Registo bem-sucedido! Bem-vindo, ${response.fullName}`,
            'Fechar',
            { duration: 5000 }
          );

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err) => {
          const msg =
            Array.isArray(err.error) ? err.error.join(', ') :
            err.error?.message ||
            err.message ||
            'Erro ao registar. Tenta novamente.';

          this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        }
      });
  }
}
