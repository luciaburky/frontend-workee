import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../usuario';
import { UsuarioListadoDTO } from './listado-usuarios/usuario-listado-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = 'http://localhost:9090/usuarios';
  
  constructor(private http: HttpClient) {}

  findAll(): Observable<UsuarioListadoDTO[]> {
    console.log("intento getear los usuarios")
    return this.http.get<UsuarioListadoDTO[]>(this.url);
  }

  findById(idUsuario:number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${idUsuario}`);
  }

  modificarRol(idUsuario: number, idRol: number): Observable<any> {
    console.log("entre al service de usuario y al metodo de modificar, el usuario es el ", idUsuario, " id de rol: ", idRol)
    return this.http.put(
      `${this.url}/modificarRol/${idUsuario}`, 
      idRol,  // Angular lo serializa como JSON: 1
      { headers: { 'Content-Type': 'application/json' } }
    );
    // return this.http.put(`${this.url}/modificarRol/${idUsuario}`, idRol);
  }
  
  eliminarUsuario(idUsuario: number) {
    console.log("intento eliminar el usuario con id: ", idUsuario)
    // return this.http.delete(`${this.url}/${idUsuario}`);
    return this.http.delete(`http://localhost:9090/usuarios/${idUsuario}`, { responseType: 'text' });
  }
  
  filtrarUsuarios(idsRoles: number[] | null): Observable<UsuarioListadoDTO[]> {
    console.log("geteo usuarios con rol: ", idsRoles);
    const body = {
      "idsRol": idsRoles
    }
    console.log("este es el body que voy a mandar en la request: ", body)
    return this.http.put<UsuarioListadoDTO[]>(`${this.url}/porRol`, body);
  }
  
}
