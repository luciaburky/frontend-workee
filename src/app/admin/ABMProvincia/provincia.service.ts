import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Provincia } from './provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private url: string = 'http://localhost:9090/provincias';
  id = new BehaviorSubject<number | null>(null);
  id$ = this.id.asObservable();

  constructor(private http: HttpClient) { };

  getProvinciasPorPais(idPais: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.url}/provinciasPorPais/${idPais}`);
  }

}
