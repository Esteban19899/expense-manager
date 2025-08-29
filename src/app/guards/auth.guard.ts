import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // Obtiene la sesión del usuario de forma asíncrona
  const { data: { session } } = await supabaseService.supabaseClient.auth.getSession();

  // Si hay una sesión, permite la navegación
  if (session) {
    return true;
  }

  // Si no hay sesión, redirige al usuario a la página de login
  return router.navigate(['/login']);
};