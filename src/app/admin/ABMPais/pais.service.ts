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

  getId(){
    return this.id$;
  }
  
  agregarPais(nombrePais:string){
    const urlEndpoint = this.url + 'crearpais';
    const body ={
      "nombrePais":nombrePais
    }
    return this.http.post(urlEndpoint,body);
  }

}
