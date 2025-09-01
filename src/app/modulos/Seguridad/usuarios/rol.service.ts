import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rol } from './../rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = 'http://localhost:9090/roles';

  idSubject = new BehaviorSubject<number | null>(null);
  
  
  constructor(private http: HttpClient) {}

  setId(id: number) {
    this.idSubject.next(id);
  }
  
  getId(){
    return this.idSubject.asObservable();
  }

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

  findById(idRol: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${idRol}`);
  }
    
  deshabilitar(idRol: number) {
    return this.http.delete<void>(`${this.url}/deshabilitar/${idRol}`);
  }

  habilitar(idRol: number) {
    const body = {
      "idRol": idRol
    }      
    return this.http.put<Rol>(`${this.url}/habilitar/${idRol}`, body);
  }
}
