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
    path: 'privacidade',
    loadComponent: () => import('./pages/privacidade/privacidade.component').then(m => m.PrivacidadeComponent)
  },
  {
    path: 'servicos',
    loadComponent: () => import('./pages/servicos/servicos.component').then(m => m.ServicosComponent)
  },
  {
    path: 'vagas',
    loadComponent: () => import('./pages/vagas/vagas.component').then(m => m.VagasComponent)
  },
  {
    path: 'formulario',
    loadComponent: () => import('./pages/vaga/formulario/formulario.component').then(m => m.FormularioComponent)
  },
  {
    path: 'vaga',
    loadComponent: () => import('./pages/vaga/vaga.component').then(m => m.VagaComponent)
  },
  {
    path: 'formulario',
    loadComponent: () => import('./pages/vaga/formulario/formulario.component').then(m => m.FormularioComponent)
  },
  {
    path: 'formacao',
    loadComponent: () => import('./pages/formacao/formacao.component').then(m => m.FormacaoComponent)
  },
  {
    path: 'formacao-detalhes',
    loadComponent: () => import('./pages/formacao-detalhes/formacao-detalhes.component').then(m => m.FormacaoDetalhesComponent)
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
    path: 'empresa/centro-formacao',
    loadComponent: () => import('./utilizadores/empresa/centro-formacao/centro-formacao.component').then(m => m.CentroFormacaoComponent)
  },
  {
    path: 'empresa/novas-vagas',
    loadComponent: () => import('./utilizadores/empresa/novas-vagas/novas-vagas.component').then(m => m.NovasVagasComponent)
  }
];



