import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { StorageService } from './stoage.service';

@Injectable({ providedIn: 'root' })
export class SesionService {
  redirectUrl: string = '';

  // Log In Event dispatcher
  private announceSource = new Subject<string>();
  // For login subscribers.
  announced$ = this.announceSource.asObservable();

  private endpointURL = 'http://localhost:9090/auth';

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) {}

  /**
   * POST existing token and invalidates it on the server for no further usage.
   */
  logout(): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${this.endpointURL}/logout`, null, options).pipe(
      tap(() => this.clearLocalSession()),
      catchError((error) => {
        console.error('Falló el logout', error);
        throw error;
      })
    );
  }

  /**
   * Clear all the session data stored in the browser and notifies session listening components.
   */
  clearLocalSession(): void {
    // Limpia local y session storage de forma SSR-safe
    this.storage.clearAll();
    // Después de limpiar todo, seteamos el flag (si estamos en browser esto persiste)
    this.storage.setItem('isLoggedIn', 'false');
    // Si tenés listeners de sesión, podrías emitir algo:
    this.announceSource.next('logout');
  }

  /**
   * Returns the local stored session obtained by the last "login" action.
   */
  getCurrentSesion(): string | null {
    // En tu código guardás el token en currentSession (string). Si fuera JSON, acá lo parseás.
    return this.storage.getItem('currentSession');
  }

  /**
   * Return the local stored session state obtained by the last "login" action.
   */
  isLoggedIn(): boolean {
    return this.storage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Start local session persisting token and session flags
   */
  startLocalSession(token: string): void {
    this.storage.setItem('token', token);
    this.storage.setItem('currentSession', token);
    this.storage.setItem('isLoggedIn', 'true');
    // Podés notificar a subscriptores que hay login:
    this.announceSource.next('login');
  }

  /**
   * Read token (SSR-safe)
   */
  getToken(): string | null {
    return this.storage.getItem('token');
  }

  getPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  getCorreoUsuario(): string | null {
    const payload = this.getPayload();
    // console.log("el payload es: ", payload)
    return payload?.sub || payload?.correoUsuario || null;
  }
}
