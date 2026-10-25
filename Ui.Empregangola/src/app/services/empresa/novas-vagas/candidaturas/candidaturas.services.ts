import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

export interface CandidaturasDto
{
  UseProfileCv : boolean,
  NewCv : string,
  PresentationLetter : string,
  SalaryPretention : number,
  StartAvailability : number,
  ShareCv : boolean,
  AppliedDate : string,
  AppUserId : string,
  VacancyId : number
}

@Injectable({
  providedIn: 'root',
})

export class CriarCandidatura
{
  constructor(private http: HttpClient){}

  private get headers()
  {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  guardarCandidatura(dados: any)
  {
    return this.http.post(`${environment.apiUrl}/api/JobApplication`, dados, { headers: this.headers });
  }
}
