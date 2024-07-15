import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ReservaResponse {
  code: number;
  msm: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservarService {
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://server.ladiestoys.com.co/reservar';
  
  constructor() { }

  crearReserva(
    data: {
      idUser: number,
      idRoom: number,
      fechaini: string,
      fechafin: string
    }, 
    token: string
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this._http.post(this.apiUrl, data, { headers })
  }
}
