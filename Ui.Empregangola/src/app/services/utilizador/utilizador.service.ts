import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateUserDetaisDTO } from './utilizador.dto';

@Injectable({
  providedIn: 'root',
})
export class UtilizadorService {
  private apiUrl = 'https://localhost:44372/api/UserDetails';

  constructor(private http: HttpClient) { }

  getUserDetails(appUserId: string)
  {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<CreateUserDetaisDTO>(`${this.apiUrl}/${appUserId}`, { headers });
  }

  guardarUtilizador(dados: any)
  {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(this.apiUrl, dados, { headers });
  }
}
