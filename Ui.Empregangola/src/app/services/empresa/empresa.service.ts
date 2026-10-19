import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmpresaDTO } from './empresa.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class EmpresaService {

  constructor(private http: HttpClient) { }

  guardarEmpresa(dados: any){
    const token = localStorage.getItem('token');
    
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(`${environment.apiUrl}/api/CompanyDetails`, dados, { headers });
  }

  getCompanyDetails(appUserId: string){
    const token = localStorage.getItem('token');

    const headers = {
      Authorization : `Bearer ${token}`
    }

    return this.http.get<EmpresaDTO>(`${environment.apiUrl}/api/CompanyDetails/${appUserId}`, { headers });
  }
}
