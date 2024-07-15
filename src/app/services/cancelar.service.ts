import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CancelarService {
  
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://server.ladiestoys.com.co/cancelar_reserva';

  constructor() { }

  CancelarReserva(
    data: {
      idUser: number,
      idReserva: number
    }, 
    token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const req = new HttpRequest('DELETE', this.apiUrl, data, { headers });
    return this._http.request(req);
  }
}
