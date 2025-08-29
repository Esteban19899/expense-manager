import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  currentUser = this.supabaseService.currentUser;

  getAvatarUrl(user: User): string {
    if (user.user_metadata?.['avatar_url']) {
      return user.user_metadata['avatar_url'];
    }
    const emailInitial = user.email ? user.email.charAt(0).toUpperCase() : 'U';
    return `https://via.placeholder.com/30/0000FF/FFFFFF?text=${emailInitial}`;
  }

  async onLogout() {
    await this.supabaseService.supabaseClient.auth.signOut();
    this.router.navigate(['/login']);
  }
}