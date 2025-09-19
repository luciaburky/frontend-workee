import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PostulacionSimplificadaDTO } from "./postulacion-simplificada-dto";

@Injectable({
  providedIn: 'root'
})
export class PostulacionService {

    private url: string = 'http://localhost:9090/postulaciones';

    idSubject = new BehaviorSubject<number | null>(null);

    constructor(private http: HttpClient) { };

    getPostulaciones(idCandidato: number): Observable<PostulacionSimplificadaDTO[]> {
      return this.http.get<PostulacionSimplificadaDTO[]>(`${this.url}/${idCandidato}/postulaciones`);
    }
}
