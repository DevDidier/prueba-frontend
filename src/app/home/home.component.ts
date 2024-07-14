import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  router = inject(Router);
  constructor(private cookieService: CookieService) {}

  navigateToLogin() {
    this.router.navigate(['/login'])
  }

/*   ngOnInit() {
    const tokenExiste = this.getCookie();
    if (!tokenExiste) {
      this.navigateToLogin();
    }
  } */
  
  getCookie() {
    const valorToken = this.cookieService.get('token');
    return valorToken !== '';
  }
}
