import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmpresaDTO } from './empresa.dto';

@Injectable({
  providedIn: 'root',
})

export class EmpresaService {
  private apiUrl = 'https://localhost:44372/api/CompanyDetails';

  constructor(private http: HttpClient) { }

  guardarEmpresa(dados: any){
    const token = localStorage.getItem('token');
    
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(this.apiUrl, dados, { headers });

  }

  getCompanyDetails(appUserId: string){
    const token = localStorage.getItem('token');

    const headers = {
      Authorization : `Bearer ${token}`
    }

    return this.http.get<EmpresaDTO>(`${this.apiUrl}/${appUserId}`, { headers });
  }
}
