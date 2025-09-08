import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


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
    //idEmpresa: number,
    idModalidadOferta: number,
    idTipoContratoOferta: number,
    idHabilidades: number[],
  ){
    const body = {
        titulo,
        descripcion,
        responsabilidades,
        //idEmpresa,
        idModalidadOferta,
        idTipoContratoOferta,
        idHabilidades,
    };
    return this.http.post(`${this.url}`, body);
  }
}
