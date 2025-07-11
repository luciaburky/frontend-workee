import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pais } from './pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private url: string = 'http://localhost:9090/paises';
  id = new BehaviorSubject<number | null>(null);
  id$ = this.id.asObservable();

  constructor(private http: HttpClient) { };

  findAll(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.url);
  }
  
  deshabilitar(idPais:number) {
    console.log("Deshabilito pais con id: " + idPais);
    return this.http.delete<void>(`${this.url}/${idPais}`);
  }
  
  habilitar(idPais:number) {
    console.log("Habilito pais con id: " + idPais);
    const body = {
      "idPais": idPais
    }
    return this.http.put<Pais>(`${this.url}/habilitar/${idPais}`, body);
  }

  getId(){
    return this.id$;
  }
  
  crearPais(nombrePais: string){
    const body ={
      "nombrePais": nombrePais
    }
    return this.http.post(this.url,body);
  }

}
