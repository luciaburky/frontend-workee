import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Etapa } from './etapa';

@Injectable({
  providedIn: 'root'
})
export class EtapaService {
  private url: string = 'http://localhost:9090/etapas';
  id = new BehaviorSubject<number | null>(null);
  
  idSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { };

  findAll(): Observable<Etapa[]> {
    return this.http.get<Etapa[]>(this.url);
  }
  
  findById(idEtapa: number): Observable<Etapa> {
    return this.http.get<Etapa>(`${this.url}/${idEtapa}`);
  }
  
  deshabilitar(idEtapa: number) {
    return this.http.delete<void>(`${this.url}/${idEtapa}`);
  }
  
  habilitar(idEtapa: number) {
    const body = {
      "idEtapa": idEtapa
    }
    return this.http.put<Etapa>(`${this.url}/habilitar/${idEtapa}`, body);
  }
  
  setId(id: number) {
    this.idSubject.next(id);
    console.log("seteo id: ", id);
  }
  
  getId() {
    console.log("geteo id: ",this.idSubject.asObservable());
    return this.idSubject.asObservable();
  }
  
  crearEtapa(nombreEtapa: string, descripcionEtapa: string){
    const body = {
      "nombreEtapa": nombreEtapa,
      "descripcionEtapa": descripcionEtapa
    }
    return this.http.post(this.url,body);
  }
  
  modificarEtapa(nombreEtapa: string, descripcionEtapa: string, idEtapa: number) {
    const body = {
      "nombreEtapa": nombreEtapa,
      "descripcionEtapa": descripcionEtapa
    }
    return this.http.put(`${this.url}/${idEtapa}`,body);
  }

}

