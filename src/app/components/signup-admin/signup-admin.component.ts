import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup-admin',
  templateUrl: './signup-admin.component.html',
  styleUrls: ['./signup-admin.component.css']
})
export class SignupAdminComponent {
  user = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  registerAdmin() {
    this.authService.registerAdmin(this.user).subscribe(() => {

    }, err => {
      alert("Administrador correctamente agregado a la base de datos")
    });
  }
}
