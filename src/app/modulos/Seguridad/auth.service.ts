import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

    private url = 'http://localhost:9090/auth';

    constructor(private http: HttpClient) {}

    registrarCandidato(
    nombreCandidato: string,
    apellidoCandidato: string,
    fechaDeNacimiento: Date,
    idProvincia: number,
    idEstadoBusqueda: number,
    idGenero: number,
    idHabilidades: number[],
    enlaceCV: string,
    correoCandidato: string,
    contrasenia: string,
    repetirContrasenia: string,
    urlFotoPerfil: string
  ) {
    const body = {
      nombreCandidato,
      apellidoCandidato,
      fechaDeNacimiento,
      idProvincia,
      idEstadoBusqueda,
      idGenero,
      idHabilidades,
      enlaceCV,
      correoCandidato,
      contrasenia,
      repetirContrasenia,
      urlFotoPerfil
    };
    return this.http.post(`${this.url}/registroCandidato`, body);
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
    return this.http.post(`${this.url}/registroEmpresa`, body);
  }


  login(
    correo: string,
    contrasenia: string
  ) {
    const body = {
    correo,
    contrasenia
    }
    return this.http.post(`${this.url}/login`, body);
  }



}



