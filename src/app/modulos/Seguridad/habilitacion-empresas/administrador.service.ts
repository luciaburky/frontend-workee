import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../../empresa/empresa/empresa';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  
  private url = 'http://localhost:9090/administrador';
  
  constructor(private http: HttpClient) {}

  getEmpresasPorHabilitar(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`/habilitaciones`);
  }

}
