import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const { data: { session } } = await supabaseService.supabaseClient.auth.getSession();

  if (session) {
    // Si hay una sesión, redirige al dashboard y no permite el acceso a /login
    router.navigate(['/dashboard']);
    return false;
  } else {
    // Si no hay sesión, permite el acceso a la ruta de login
    return true;
  }
};