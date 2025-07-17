import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsuarioEmpleadoRequest } from './usuario-empleado-request';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private url: string = 'http://localhost:9090/empleados-empresa';
  
  idSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { };

  findAll(): Observable<UsuarioEmpleadoRequest[]> {
    return this.http.get<UsuarioEmpleadoRequest[]>(`${this.url}/traerTodos/1`);
  }

  cantidadActivos(): Observable<number> {
    return this.http.get<number>(`${this.url}/contarEmpleados/1`);
  }

  // findAllActivos(): Observable<TipoHabilidad[]> {
  //   return this.http.get<any[]>(`${this.url}/activos`);
  // }
  
  // findById(idTipoHabilidad: number): Observable<TipoHabilidad> {
  //   return this.http.get<TipoHabilidad>(`${this.url}/${idTipoHabilidad}`);
  // }
  
  // deshabilitar(idTipoHabilidad: number) {
  //   return this.http.delete<void>(`${this.url}/${idTipoHabilidad}`);
  // }
  
  // habilitar(idTipoHabilidad: number) {
  //   const body = {
  //     "idTipoHabilidad": idTipoHabilidad
  //   }
  //   return this.http.put<TipoHabilidad>(`${this.url}/habilitar/${idTipoHabilidad}`, body);
  // }
  
  // setId(id: number) {
  //   this.idSubject.next(id);
  // }
  
  // getId(){
  //   return this.idSubject.asObservable();
  // }
  
  // crearTipoHabilidad(nombreTipoHabilidad: string){
  //   const body = {
  //     "nombreTipoHabilidad": nombreTipoHabilidad
  //   }
  //   return this.http.post(this.url,body);
  // }
  
  // modificarTipoHabilidad(idTipoHabilidad: number, nombreTipoHabilidad: string) {
  //   const body = {
  //     "nombreTipoHabilidad": nombreTipoHabilidad
  //   }
  //   return this.http.put(`${this.url}/${idTipoHabilidad}`,body);
  // }
}

