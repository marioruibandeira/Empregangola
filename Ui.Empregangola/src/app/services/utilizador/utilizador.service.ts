import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateUserDetaisDTO } from './utilizador.dto';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class UtilizadorService {

  constructor(private http: HttpClient) { }

  getUserDetails(appUserId: string)
  {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.get<CreateUserDetaisDTO>(`${environment.apiUrl}/api/UserDetails/${appUserId}`, { headers });
  }

  guardarUtilizador(dados: any)
  {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(`${environment.apiUrl}/api/UserDetails/`, dados, { headers });
  }
}
