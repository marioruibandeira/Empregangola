import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodosUtilizadoresDTO } from './todos-utilizadores.service.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class TodosUtilizadoresService {

  constructor(private http: HttpClient) { }

  getAllUsers(){
    const token = localStorage.getItem('token');

    const headers = {
      Authorization : `Bearer ${token}`
    }

    return this.http.get<TodosUtilizadoresDTO[]>(
      `${environment.apiUrl}/api/UserDetails/allUsers`,
      { headers }
    );
  }
}
