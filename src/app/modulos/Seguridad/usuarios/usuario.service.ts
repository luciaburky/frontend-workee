import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = 'http://localhost:9090/usuarios';
  
  constructor(private http: HttpClient) {}

  findAll(): Observable<Usuario[]> {
    console.log("intento getear los usuarios")
    return this.http.get<Usuario[]>(this.url);
  }

  findById(idUsuario:number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${idUsuario}`);
  }

  modificarRol(idUsuario: number, idRol: number): Observable<any> {
    return this.http.put(`${this.url}/modificarRol/${idUsuario}`, idRol);
  }
  
  eliminarUsuario(idUsuario: number) {
    return this.http.put(`${this.url}/${idUsuario}`, null);
  }
  
}
