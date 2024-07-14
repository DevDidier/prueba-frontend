import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CambiarreservaService {

  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://localhost:7221/modificar_reserva';
  
  constructor() { }

  CambiarReserva( 
    data: {
    idReserva: number,
    fechaini: string,
    fechafin: string
  }, 
  token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this._http.patch(`${this.apiUrl}`, data, { headers })
  }
}
