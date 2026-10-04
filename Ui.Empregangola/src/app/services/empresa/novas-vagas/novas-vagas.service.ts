import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { VagaDTO } from './vaga.dto';

@Injectable({
  providedIn: 'root',
})
export class NovasVagasService {
  constructor(private http: HttpClient) { }

  guardarVaga(dados: any) {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.post(`${environment.apiUrl}/api/Vacancies`, dados, { headers });
  }
}



