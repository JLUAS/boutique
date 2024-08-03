import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AuthGuard } from './services/auth-guard.service';
import { AdminGuard } from './services/auth.guard';
import { VentasComponent } from './pages/ventas/ventas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CajaComponent } from './pages/caja/caja.component';
import { CrearOrdenComponent } from './pages/crear-orden/crear-orden.component';
import { VerOrdenesComponent } from './pages/ver-ordenes/ver-ordenes.component';
import { EditarOrdenComponent } from './pages/editar-orden/editar-orden.component';

const routes: Routes = [
  {path: '', component:LoginComponent},
  {path:"login", component:LoginComponent},
  {path:"dashboard", component:DashboardComponent, canActivate: [AdminGuard]},
  {path:"dashboard/ventas", component:VentasComponent, canActivate: [AdminGuard]},
  {path:"dashboard/usuarios", component:UsuariosComponent, canActivate: [AdminGuard]},
  {path:"dashboard/productos", component:MenuComponent, canActivate: [AdminGuard]},
  {path:"dashboard/caja", component:CajaComponent, canActivate: [AdminGuard]},
  {path:"usuario", component:UsuarioComponent, canActivate: [AuthGuard]},
  {path:"usuario/crear/orden", component:CrearOrdenComponent, canActivate: [AuthGuard]},
  {path:"usuario/ver/orden", component:VerOrdenesComponent, canActivate: [AuthGuard]},
  {path:"usuario/editar/orden", component:EditarOrdenComponent, canActivate: [AuthGuard]},
  {path:"usuario/dashboard", component:CrearOrdenComponent, canActivate: [AuthGuard]},
  {path:"**", redirectTo:"login"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
