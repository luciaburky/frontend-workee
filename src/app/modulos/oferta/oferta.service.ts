import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ofertaEtapaDTO } from '../gestion de ofertas/crear oferta/ofertaEtapaDTO';
import { Oferta } from './oferta';


@Injectable({
  providedIn: 'root'
})
export class OfertaService {
  private url: string = 'http://localhost:9090/ofertas';
  
  idSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { };

  crearOferta(
    titulo: string,
    descripcion: string,
    responsabilidades: string,
    idModalidadOferta: number,
    idTipoContratoOferta: number,
    idHabilidades: number[],
    idEmpresa: number,
    ofertaEtapas: ofertaEtapaDTO[] = [],
  ){
    const body = {
        titulo,
        descripcion,
        responsabilidades,
        idModalidadOferta,
        idTipoContratoOferta,
        idHabilidades,
        idEmpresa,        
        ofertaEtapas,
    };
    return this.http.post(`${this.url}`, body);
  }

  getOferta(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${this.url}/${id}`);
    
  }

  getOfertasPorEmpresa(id: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.url}/empresa/${id}`);
  }
}
