import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  authForm!: FormGroup;
  formSubmitted = false;
  authError: string | null = null; // Variable para almacenar el error

  constructor() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Método que se llama cuando el usuario intenta iniciar sesión
  async onLogin() {
    this.formSubmitted = true;
    this.authError = null; // Limpiar cualquier error anterior
    if (this.authForm.invalid) {
      return;
    }

    const { email, password } = this.authForm.value;
    const { error } = await this.supabaseService.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.authError = 'Email o contraseña incorrectos. Por favor, inténtelo de nuevo.';
      console.error(`Error al iniciar sesión: ${error.message}`);
    } else {
      this.authForm.reset();
      this.formSubmitted = false;
      this.router.navigate(['/dashboard']);
    }
  }

  // Método para registrar un nuevo usuario
  async onRegister() {
    this.formSubmitted = true;
    this.authError = null; // Limpiar cualquier error anterior
    if (this.authForm.invalid) {
      return;
    }

    const { email, password } = this.authForm.value;
    const { data, error } = await this.supabaseService.supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      this.authError = 'Error al registrarse. Por favor, revise su email o intente más tarde.';
      console.error(`Error al registrarse: ${error.message}`);
    } else {
      console.log('¡Usuario registrado con éxito! Verifique su email.');
      this.authForm.reset();
      this.formSubmitted = false;
      this.router.navigate(['/dashboard']);
    }
  }

  // Nuevo método para iniciar sesión con Google
  async signInWithGoogle() {
    const { error } = await this.supabaseService.supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: environment.supabaseRedirectUrl
      }
    });

    if (error) {
      this.authError = 'Error al iniciar sesión con Google.';
      console.error(`Error de autenticación con Google: ${error.message}`);
    }
  }

  // Método para determinar si se debe mostrar un error de validación del formulario
  shouldShowError(controlName: string): boolean {
    const control = this.authForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.formSubmitted);
  }
}