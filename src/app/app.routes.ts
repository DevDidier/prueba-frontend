import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HabitacionesComponent } from './habitaciones/habitaciones.component';
import { ReservasComponent } from './reservas/reservas.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: 'home',
      component: HomeComponent,
      children: [
        { path: 'habitaciones', component: HabitacionesComponent },
        { path: 'reservas', component: ReservasComponent }
      ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'singup', component: SignupComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full'}
     /* { path: 'about', component: AboutComponent },
    { path: 'carro', component: CarroComponent}, */
];
