// service-visualizar-perfil-empresa.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from './empresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private url = 'http://localhost:9090/empresas';

  constructor(private http: HttpClient) {}
  
  findById(idEmpresa: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.url}/${idEmpresa}`);
  }
  
  modificarEmpresa(idEmpresa: number,
                   nombreEmpresa: string,
                   descripcionEmpresa: string,
                   idRubro: number,
                   telefonoEmpresa: number,
                   direccionEmpresa: string,
                   sitioWebEmpresa: string,
                   contrasenia: string,
                   repetirContrasenia: string) {
    const body = {
      "sitioWebEmpresa": sitioWebEmpresa,
      "nombreEmpresa": nombreEmpresa,
      "descripcionEmpresa": descripcionEmpresa,
      "telefonoEmpresa": telefonoEmpresa,
      "direccionEmpresa": direccionEmpresa,
      "idRubro": idRubro,
      "numeroIdentificacionFiscal": null,
      "emailEmpresa": null,
      "contrasenia": contrasenia,
      "repetirContrasenia": repetirContrasenia,
      "idProvincia": null
    }
    return this.http.put(`${this.url}/modificarPerfil/${idEmpresa}`, body);
  }

  eliminarEmpresa(idEmpresa: number) {
    return this.http.delete<void>(`${this.url}/${idEmpresa}`);
  }

  registrarEmpresa(
    nombreEmpresa: string,
    descripcionEmpresa: string,
    telefonoEmpresa: number,
    direccionEmpresa: string,
    idRubro: number,
    numeroIdentificacionFiscal: string,
    emailEmpresa: string,
    contrasenia: string,
    repetirContrasenia: string,
    idProvincia: number,
    urlFotoPerfil: string,
    urlDocumentoLegal: string,
    sitioWebEmpresa: string
  ) {
  const body = {
      sitioWebEmpresa,
      nombreEmpresa,
      descripcionEmpresa,
      telefonoEmpresa,
      direccionEmpresa,
      idRubro,
      numeroIdentificacionFiscal,
      emailEmpresa,
      contrasenia,
      repetirContrasenia,
      idProvincia,
      urlFotoPerfil,
      urlDocumentoLegal
  };
    return this.http.post(`${this.url}`, body);
  }

  
}