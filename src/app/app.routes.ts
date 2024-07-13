import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { CarroComponent } from './carro/carro.component';

export const routes: Routes = [
    { path: 'home',
      component: HomeComponent,
      children: [
        { path: 'carro', component: CarroComponent },
        { path: 'about', component: AboutComponent }
      ]
    },
    /* { path: 'about', component: AboutComponent },
    { path: 'carro', component: CarroComponent}, */
    { path: '', component: LoginComponent},/*
    { path: '', redirectTo: 'login', pathMatch: 'full'} */
];
