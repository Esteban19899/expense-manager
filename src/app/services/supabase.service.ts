import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Creamos una signal para guardar el usuario actual. El valor inicial es null.
  public currentUser = signal<User | null>(null);

  constructor() {
    // Inicializa el cliente de Supabase con tus credenciales
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );

    // Nos suscribimos a los cambios de estado de autenticación en tiempo real.
    // Esto se ejecutará cada vez que el usuario inicie o cierre sesión.
    this.supabase.auth.onAuthStateChange((event, session) => {
      // Actualizamos el valor de la signal con el nuevo usuario o null si no hay sesión.
      this.currentUser.set(session ? session.user : null);
    });
  }

  // Getter para acceder al cliente de Supabase desde otros componentes.
  get supabaseClient(): SupabaseClient {
    return this.supabase;
  }
}