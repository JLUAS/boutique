import { Component } from '@angular/core';
import { AuthGuard } from '../../services/auth-guard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent {
  constructor(private authService: AuthService){}
  logout() {
    this.authService.logout();
  }
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
