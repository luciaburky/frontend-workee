import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Empleado } from './empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private url: string = 'http://localhost:9090/empleadosEmpresa';
  
  idSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { };

  findAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.url}/traerTodos/1`);
  }

  cantidadActivos(): Observable<number> {
    return this.http.get<number>(`${this.url}/contarEmpleados/1`);
  }
  
  crearEmpleado(nombreEmpleadoEmpresa: string,
                apellidoEmpleadoEmpresa: string,
                puestoEmpleadoEmpresa: string,
                correoEmpleadoEmpresa: string,
                contrasenia: string,
                repetirContrasenia: string) {
    const body = {
      "nombreEmpleadoEmpresa": nombreEmpleadoEmpresa,
      "apellidoEmpleadoEmpresa": apellidoEmpleadoEmpresa,
      "puestoEmpleadoEmpresa": puestoEmpleadoEmpresa,
      "correoEmpleadoEmpresa": correoEmpleadoEmpresa,
      "contrasenia": contrasenia,
      "repetirContrasenia": repetirContrasenia,
      "idEmpresa": 1,
      "urlFotoPerfil": "urlFoto"
    }
    return this.http.post(this.url,body);
  }

  modificarEmpleadoComoEmpresa(puestoEmpleadoEmpresa: string, idEmpleado: number) {
    const body = {
      "nombreEmpleadoEmpresa": null,
      "apellidoEmpleadoEmpresa": null,
      "puestoEmpleadoEmpresa": puestoEmpleadoEmpresa,
      "correoEmpleadoEmpresa": null,
      "contrasenia": null,
      "repetirContrasenia": null,
      "idEmpresa": 1
    }
    console.log(body);
    return this.http.put(`${this.url}/actualizarPerfilPorAdmin/${idEmpleado}`,body);
  }

  modificarEmpleadoComoEmpleado(nombreEmpleadoEmpresa: string,
                                apellidoEmpleadoEmpresa: string,
                                idEmpleado: number,
                                idEmpresa: number,
                                urlFotoPerfil: string) {
                                  const body = {
      "nombreEmpleadoEmpresa": nombreEmpleadoEmpresa,
      "apellidoEmpleadoEmpresa": apellidoEmpleadoEmpresa,
      "puestoEmpleadoEmpresa": null,
      "correoEmpleadoEmpresa": null,
      "contrasenia": null,
      "repetirContrasenia": null,
      "idEmpresa": idEmpresa,
      "urlFotoPerfil": urlFotoPerfil,
      "contraseniaActual": null
    }
    return this.http.put(`${this.url}/actualizarPerfilPropio/${idEmpleado}`,body);
  }

  setId(id: number) {
    this.idSubject.next(id);
  }
  
  getId(){
    return this.idSubject.asObservable();
  }
  
  findById(idEmpleado: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.url}/${idEmpleado}`);
  }

  eliminarEmpleado(idEmpleado: number) {
    return this.http.delete<void>(`${this.url}/${idEmpleado}`);
  }
  
  // findAllActivos(): Observable<TipoHabilidad[]> {
  //   return this.http.get<any[]>(`${this.url}/activos`);
  // }
  
  // habilitar(idTipoHabilidad: number) {
  //   const body = {
  //     "idTipoHabilidad": idTipoHabilidad
  //   }
  //   return this.http.put<TipoHabilidad>(`${this.url}/habilitar/${idTipoHabilidad}`, body);
  // }
  
  
  // modificarTipoHabilidad(idTipoHabilidad: number, nombreTipoHabilidad: string) {
  //   const body = {
  //     "nombreTipoHabilidad": nombreTipoHabilidad
  //   }
  //   return this.http.put(`${this.url}/${idTipoHabilidad}`,body);
  // }
}

