import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class FuncionarioDosUtilizadores{
  constructor(private http: HttpClient){}

  guardarUtilizadorComoFuncionario(dados: any){
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(`${environment.apiUrl}/api/EmployeeFromUsers`, dados, { headers });
  }
}
