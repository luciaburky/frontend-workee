// service-visualizar-perfil-empresa.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceVisualizarPerfilEmpresaService {
  private url = 'http://localhost:9090/empresas'; // Asegurate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

obtenerEmpresaPorId(empresaId: number): Observable<any> {
  return this.http.get<any>(`${this.url}/${empresaId}`);
}
}