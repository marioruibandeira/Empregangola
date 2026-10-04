import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoryDTO {
  categoryId: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})

export class CategoryService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${environment.apiUrl}/api/Category`);
  }
}
