import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProvinceDTO {
  provinceId: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<ProvinceDTO[]> {
    return this.http.get<ProvinceDTO[]>(`${environment.apiUrl}/api/Province`);
  }
}
