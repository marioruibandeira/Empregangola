import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// ---------- Cartão de vaga na listagem pública ----------
export interface VagaPublicaDTO {
  vacanciesId: number;
  title: string;
  companyName: string;
  provinceName: string;
  municipality: string;
  contractType: number | null;
  workMode: number | null;
  minimumExperience: number;
  summary: string;
  publishedAt: string;   // ISO 8601
}

// ---------- Vaga completa (página de detalhe) ----------
export interface VagaPublicaDetalheDTO {
  vacanciesId: number;
  title: string;
  companyName: string;
  categoryName: string;
  provinceName: string;
  municipality: string;
  contractType: number | null;
  workMode: number | null;
  numberOfVacancies: number;
  diaspora: boolean;
  description: string;
  educationLevel: number;
  minimumExperience: number;
  salaryMin: number | null;
  salaryMax: number | null;
  negotiableSalary: boolean;
  deadline: string | null;
  isExpired: boolean;
  publishedAt: string;
  applicationMethod: number;   // 1 = plataforma, 2 = email, 3 = link
  applicationTarget: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  languages: string[];
}

// ---------- Resposta paginada da API ----------
export interface PaginaDTO<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---------- Filtros aceites pela API ----------
export interface FiltrosVagas {
  q?: string;
  categoryId?: number | null;
  provinceId?: number | null;
  contractType?: number | null;
  page: number;
  pageSize: number;
}

/**
 * Listagem pública de vagas: não envia token, porque os visitantes não têm sessão.
 * Não reutilizes o NovasVagasService aqui: esse junta o token a cada pedido.
 */
@Injectable({
  providedIn: 'root',
})
export class VagasPublicasService {
  constructor(private http: HttpClient) { }

  private get url() {
    return `${environment.apiUrl}/api/public/vacancies`;
  }

  listar(f: FiltrosVagas): Observable<PaginaDTO<VagaPublicaDTO>> {
    let params = new HttpParams()
      .set('page', f.page)
      .set('pageSize', f.pageSize);

    if (f.q) {
      params = params.set('q', f.q);
    }
    if (f.categoryId != null) {
      params = params.set('categoryId', f.categoryId);
    }
    if (f.provinceId != null) {
      params = params.set('provinceId', f.provinceId);
    }
    if (f.contractType != null) {
      params = params.set('contractType', f.contractType);
    }

    return this.http.get<PaginaDTO<VagaPublicaDTO>>(this.url, { params });
  }

  obter(id: number): Observable<VagaPublicaDetalheDTO> {
    return this.http.get<VagaPublicaDetalheDTO>(`${this.url}/${id}`);
  }
}
