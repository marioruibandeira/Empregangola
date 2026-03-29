/*import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'login' }
];*/

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },   // HOME
  {
    path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    //canActivate: [authGuard]
  },
  {
    path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  }
];



