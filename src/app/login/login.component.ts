import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router)
  Loading: boolean = false;

  navigateSingup() {
    this.router.navigate(['/singup'])
  }

  Loging() {
    this.Loading = true;
  }
}
