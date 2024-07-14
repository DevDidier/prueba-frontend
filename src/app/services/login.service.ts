import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LoginResponse {
  code: number;
  msm: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://localhost:7221/login';

  constructor() { }

  Login(data: {usuario: string, contrasena: string}) {
    return this._http.post(this.apiUrl, data)
  }
}