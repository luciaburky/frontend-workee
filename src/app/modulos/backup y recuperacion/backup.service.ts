import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BackupService {
  private url = 'http://localhost:9090/backup';

  idSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) {}

  generarBackup(): Observable<any> {
    return this.http.post<any>(`${this.url}/generarBackup`, null);
  }

  listarBackups(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/listarBackups`);
  }

  restaurarBackup(nombreBackup: string): Observable<any> {
    return this.http.post<any>(`${this.url}/restaurarBackup`, { nombreBackup });
  }
}
