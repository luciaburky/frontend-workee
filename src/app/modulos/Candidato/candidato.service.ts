import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidato } from './candidato';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {

  private url = 'http://localhost:9090/candidatos';

  constructor(private http: HttpClient) {}
  
  findById(idCandidato: number): Observable<Candidato> {
    return this.http.get<Candidato>(`${this.url}/${idCandidato}`);
  }

}