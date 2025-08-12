import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Candidato } from './candidato';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService {

  private url = 'http://localhost:9090/candidatos';

  constructor(private http: HttpClient) {}
  
  findById(idCandidato: number): Observable<Candidato> {
    return this.http.get<Candidato>(`${this.url}/${idCandidato}`);
  }

  modificarCandidato(idCandidato: number,
                    nombreCandidato: string,
                    apellidoCandidato: string,
                    idProvincia: number,
                    idEstadoBusqueda: number,
                    idGenero: number,
                    idHabilidades: number[],
                    contrasenia: string,
                    repetirContrasenia: string) {
    const body = {
      "nombreCandidato": nombreCandidato,
      "apellidoCandidato": apellidoCandidato,
      "fechaDeNacimiento": null,
      "idProvincia": idProvincia,
      "idEstadoBusqueda": idEstadoBusqueda,
      "idGenero": idGenero,
      "idHabilidades": idHabilidades,
      "correoCandidato": null,
      "contrasenia": contrasenia,
      "repetirContrasenia": repetirContrasenia
    }
    console.log("estoy desde el service, este es el body: ", body)
    return this.http.put(`${this.url}/${idCandidato}`, body);
  }


}