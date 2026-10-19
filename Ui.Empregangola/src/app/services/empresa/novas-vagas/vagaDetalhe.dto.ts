import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// ---------- Linha da tabela de vagas ----------
export interface VagaListaDTO {
  vacanciesId: number;
  title: string;
  categoryName: string;
  status: number;      // 1 = Rascunho, 2 = Aberta, 3 = Publicada, 4 = Encerrada
  createdAt: string;   // ISO 8601
}

// ---------- Vaga completa (modal de detalhes e edição) ----------
export interface VagaDetalheDTO {
  vacanciesId: number;
  title: string;
  categoryName: string;
  categoryId: number | null;       // vazio num rascunho
  numberOfVacancies: number;
  contractType: number | null;     // vazio num rascunho
  workMode: number | null;         // vazio num rascunho
  provinceName: string;
  provinceId: number | null;       // vazio num rascunho
  municipality: string;
  diaspora: boolean;
  description: string;
  educationLevel: number;
  experienceLevel: number;
  salaryMin: number | null;
  salaryMax: number | null;
  negotiableSalary: boolean;
  deadline: string | null;         // vazio num rascunho
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

// ---------- Bloco amarelo da lista ----------
export interface CabecalhoDTO {
  companyName: string;
  userName: string;
  lastLogin: string | null;
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

  private get url() {
    return `${environment.apiUrl}/api/Vacancies`;
  }

  guardarVaga(dados: any) {
    return this.http.post(this.url, dados, { headers: this.headers });
  }

  atualizarVaga(id: number, dados: any) {
    return this.http.put<void>(`${this.url}/${id}`, dados, { headers: this.headers });
  }

  publicarVaga(id: number) {
    return this.http.post<{ status: number }>(`${this.url}/${id}/publish`, {}, { headers: this.headers });
  }

  getMinhasVagas(): Observable<VagaListaDTO[]> {
    return this.http.get<VagaListaDTO[]>(`${this.url}/mine`, { headers: this.headers });
  }

  getVagaPorId(id: number): Observable<VagaDetalheDTO> {
    return this.http.get<VagaDetalheDTO>(`${this.url}/${id}`, { headers: this.headers });
  }

  getCabecalho(): Observable<CabecalhoDTO> {
    return this.http.get<CabecalhoDTO>(`${environment.apiUrl}/api/Me/header`, { headers: this.headers });
  }
}
