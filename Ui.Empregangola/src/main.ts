import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';  // se usares animações do Material
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),                // ← liga as rotas
    provideHttpClient(),                  // para HttpClient no AuthService
    provideAnimations()                   // para animações do Material (opcional)
  ]
}).catch(err => console.error(err));
