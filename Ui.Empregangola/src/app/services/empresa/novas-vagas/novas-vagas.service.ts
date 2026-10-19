import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface VagaListaDTO {
  vacanciesId: number;
  title: string;
  categoryName: string;
  status: number;      // 1 = Rascunho, 2 = Aberta, 3 = Publicada, 4 = Encerrada
  createdAt: string;   // ISO 8601
}

// Vaga completa, usada no modal de detalhes
export interface VagaDetalheDTO {
  vacanciesId: number;
  title: string;
  categoryName: string;
  numberOfVacancies: number;
  contractType: number;
  workMode: number;
  provinceName: string;
  municipality: string;
  diaspora: boolean;
  description: string;
  educationLevel: number;
  experienceLevel: number;
  salaryMin: number | null;
  salaryMax: number | null;
  negotiableSalary: boolean;
  deadline: string;
  applicationMethod: number;
  applicationTarget: string;
  status: number;
  createdAt: string;
  updatedAt: string | null;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  languages: string[];
}

// HEADER
export interface CabecalhoDTO {
  companyName: string;
  userName: string;
  lastLogin: string | null;
}
// Vaga completa, usada no modal de detalhes
export interface VagaDetalheDTO {
  vacanciesId: number;
  title: string;
  categoryId: number,
  categoryName: string;
  numberOfVacancies: number;
  contractType: number;
  workMode: number;
  provinceName: string;
  provinceId: number;
  municipality: string;
  diaspora: boolean;
  description: string;
  educationLevel: number;
  experienceLevel: number;
  salaryMin: number | null;
  salaryMax: number | null;
  negotiableSalary: boolean;
  deadline: string;
  applicationMethod: number;
  applicationTarget: string;
  status: number;
  createdAt: string;
  updatedAt: string | null;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  languages: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NovasVagasService {
  constructor(private http: HttpClient) { }

  private get headers() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  guardarVaga(dados: any) {
    return this.http.post(`${environment.apiUrl}/api/Vacancies`, dados, { headers: this.headers });
  }

  getMinhasVagas(): Observable<VagaListaDTO[]> {
    return this.http.get<VagaListaDTO[]>(`${environment.apiUrl}/api/Vacancies/mine`, { headers: this.headers });
  }

  getVagaPorId(id: number): Observable<VagaDetalheDTO> {
    return this.http.get<VagaDetalheDTO>(`${environment.apiUrl}/api/Vacancies/${id}`, { headers: this.headers });
  }

  publicarVaga(id: number) {
    return this.http.post<{ status: number }>(
      `${environment.apiUrl}/api/Vacancies/${id}/publish`, {}, { headers: this.headers });
  }

  getCabecalho(): Observable<CabecalhoDTO> {
    return this.http.get<CabecalhoDTO>(`${environment.apiUrl}/api/Me/header`, { headers: this.headers });
  }

  atualizarVaga(id: number, dados: any) {
    return this.http.put<void>(`${environment.apiUrl}/api/Vacancies/${id}`, dados, { headers: this.headers });
  }
}




