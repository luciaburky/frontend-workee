import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FiltroUbicacion } from './busqueda-empresas/filtro-ubicacion';
import { Empresa } from '../empresa/empresa/empresa';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  private url: string = 'http://localhost:9090/busquedas';
  
  idSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { };

  filtroUbicacion(): Observable<FiltroUbicacion[]> {
    return this.http.get<FiltroUbicacion[]>(`${this.url}/filtroUbicacion`);
  }
  
  buscarPorNombre(texto: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/empresasPorNombre?nombreEmpresa=${texto}`);
  }

  filtrarEmpresas(
                  nombreEmpresa: string | null,
                  idsRubros: number[] | null,
                  idsProvincias: number[] | null,
                  // tieneOfertasAbiertas: boolean | null
                ): Observable<Empresa[]> {
    const body = {
      "nombreEmpresa": nombreEmpresa,
      "idsRubros": idsRubros,
      "idsProvincias": idsProvincias,
      "tieneOfertasAbiertas": null
    }
    console.log("estoy desde el service, este es el body: ", body);
    return this.http.post<Empresa[]>(`${this.url}/empresasFiltradas`, body);
  }

}
