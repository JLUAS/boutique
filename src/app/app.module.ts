import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from './services/auth-guard.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatDialogModule,} from '@angular/material/dialog';
import {MatFormFieldModule,} from '@angular/material/form-field';
import {MatInputModule,} from '@angular/material/input';
import {MatButtonModule,} from '@angular/material/button';
import {MatIconModule,} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { SignupComponent } from './components/signup/signup.component';
import { SignupAdminComponent } from './components/signup-admin/signup-admin.component';
import { NavComponent } from './components/nav/nav.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { MenuComponent } from './pages/menu/menu.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CajaComponent } from './pages/caja/caja.component';
import { CrearOrdenComponent } from './pages/crear-orden/crear-orden.component';
import { VerOrdenesComponent } from './pages/ver-ordenes/ver-ordenes.component';
import { EditarOrdenComponent } from './pages/editar-orden/editar-orden.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserNavComponent } from './components/user-nav/user-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsuarioComponent,
    SignupComponent,
    SignupAdminComponent,
    NavComponent,
    VentasComponent,
    MenuComponent,
    UsuariosComponent,
    CajaComponent,
    CrearOrdenComponent,
    VerOrdenesComponent,
    EditarOrdenComponent,
    UserDashboardComponent,
    UserNavComponent
  ],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
