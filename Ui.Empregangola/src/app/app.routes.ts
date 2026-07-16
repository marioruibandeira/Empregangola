import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },   // HOME
  {
    path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'contactos',
    loadComponent: () => import('./pages/contactos/contactos.component').then(m => m.ContactosComponent)
  },
  {
    path: 'quem-somos',
    loadComponent: () => import('./pages/quemsomos/quemsomos.component').then(m => m.QuemsomosComponent)
  },
  {
    path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'utilizador',
    loadComponent: () => import('./utilizadores/utilizador/utilizador.component').then(m => m.UtilizadorComponent) 
  },
  {
    path: 'empresa',
    loadComponent: () => import('./utilizadores/empresa/empresa.component').then(m => m.EmpresaComponent)
  },
  {
    path: 'empresa/novas-vagas',
    loadComponent: () => import('./utilizadores/empresa/novas-vagas/novas-vagas.component').then(m => m.NovasVagasComponent)
  }
];



