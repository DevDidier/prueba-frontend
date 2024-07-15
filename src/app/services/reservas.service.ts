import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private readonly _http = inject(HttpClient);
  private apiUrl = 'https://server.ladiestoys.com.co/misreservas';

  constructor() { }

  GetReservas(idUser:number, token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this._http.get(`${this.apiUrl}/${idUser}`, { headers })
  }
}
