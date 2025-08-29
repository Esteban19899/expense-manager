import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
    // Redirige al login por defecto.
    { path: 'login', component: AuthComponent, canActivate: [noAuthGuard] },

    // Ruta para el componente de login. No necesita un guard
    { path: 'login', component: AuthComponent },

    // Rutas protegidas: Solo se puede acceder si el usuario está autenticado.
    { path: 'dashboard',
      component: DashboardComponent, 
      canActivate: [authGuard] 
    },

    { path: 'about', 
      component: AboutComponent, 
      canActivate: [authGuard] 
    },

    // Ruta comodín: Cualquier URL no válida redirige al login.
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
