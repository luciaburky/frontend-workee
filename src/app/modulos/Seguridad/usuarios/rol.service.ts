import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from './../rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = 'http://localhost:9090/roles';
  
  constructor(private http: HttpClient) {}

  findAll(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.url);
  }

  findByCategoria(idCategoria: number): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/porCategoria/${idCategoria}`);
  }

  crearrol(
    nombreRol: string,
    idCategoria: number,
    idPermisos: number[]
  ){
    const body = {
      nombreRol,
      idCategoria,
      idPermisos
    };
    return this.http.post(`${this.url}`, body);
    

  }

  

  modificarRol(idRol: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${idRol}`);
  }

  bajarol(){}
}
