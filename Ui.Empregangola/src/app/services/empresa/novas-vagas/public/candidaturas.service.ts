import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

// =====================================================================
//  CandidaturasService
//
//  ATENÇÃO: por agora os dois métodos SIMULAM a resposta (não existe
//  backend de candidaturas nem endpoint do perfil). Quando existirem,
//  só este ficheiro muda; a página fica igual. Em cada método está o
//  pedido HTTP que o vai substituir.
// =====================================================================

/** O que a página mostra do perfil do candidato. */
export interface PerfilResumo {
  nomeCompleto: string;
  titulo: string;
  email: string;
  telefone: string;
  localizacao: string;
  cvNome: string | null;              // CV que já está no perfil
  pretensaoSalarial: number | null;
  disponibilidade: string;
}

/** O que o candidato preenche na página de candidatura. */
export interface PedidoCandidatura {
  vacanciesId: number;
  origemCv: 'perfil' | 'novo';
  ficheiro: File | null;              // só quando origemCv = 'novo'
  carta: string;
  pretensaoSalarial: number | null;
  disponibilidade: string;
  consentimento: boolean;
}

export interface ResultadoCandidatura {
  referencia: string;
  enviadaEm: string;                  // ISO 8601
}

@Injectable({
  providedIn: 'root',
})
export class CandidaturasService {

  /**
   * TODO (API): GET `${environment.apiUrl}/api/Me/profile-summary`  (com token)
   */
  obterPerfilResumo(): Observable<PerfilResumo | null> {
    return of<PerfilResumo>({
      nomeCompleto: 'Ana Beatriz Fernandes',
      titulo: 'Engenheira de Software Full-Stack',
      email: 'ana.fernandes@exemplo.co.ao',
      telefone: '+244 923 000 000',
      localizacao: 'Talatona, Luanda',
      cvNome: 'CV-Ana-Fernandes.pdf',
      pretensaoSalarial: 650000,
      disponibilidade: 'Imediata'
    }).pipe(delay(300));
  }

  /**
   * TODO (API): POST `${environment.apiUrl}/api/Applications`  (com token, multipart/form-data)
   *
   *   const corpo = new FormData();
   *   corpo.append('vacanciesId', String(pedido.vacanciesId));
   *   corpo.append('origemCv', pedido.origemCv);
   *   if (pedido.ficheiro) corpo.append('cv', pedido.ficheiro);
   *   corpo.append('carta', pedido.carta);
   *   ...
   *   return this.http.post<ResultadoCandidatura>(url, corpo, { headers });
   *
   * A API deve responder 409 se o candidato já se candidatou a esta vaga.
   */
  enviar(pedido: PedidoCandidatura): Observable<ResultadoCandidatura> {
    const agora = new Date();

    return of<ResultadoCandidatura>({
      referencia: `CAND-${pedido.vacanciesId}-${agora.getTime().toString().slice(-6)}`,
      enviadaEm: agora.toISOString()
    }).pipe(delay(800));
  }
}
