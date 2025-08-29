import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { User } from '@supabase/supabase-js';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  currentUser = this.supabaseService.currentUser;

  // Modifica la función para que devuelva null si no hay URL
  getAvatarUrl(user: User): string | null {
    return user.user_metadata?.['avatar_url'] || null;
  }

  // Nueva función para obtener la primera letra del correo
  getEmailInitial(user: User): string {
    return user.email ? user.email.charAt(0).toUpperCase() : 'U';
  }

  async onLogout() {
    await this.supabaseService.supabaseClient.auth.signOut();
    this.router.navigate(['/login']);
  }
}