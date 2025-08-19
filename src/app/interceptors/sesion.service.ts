import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class SesionService {

  redirectUrl: string;

  // Log In Event dispatcher
  private announceSource = new Subject<string>();

  // For login subscribers.
  announced$ = this.announceSource.asObservable();

  private endpointURL = 'http://localhost:9090/auth';

  constructor(private http: HttpClient) {
    this.redirectUrl = '';
  }

  
  /**
   * POST existing token and invalidates it on the server for no further usage.
   * @returns {Observable<any>}
   */
  logout(): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.endpointURL + '/logout', null, options).pipe(
      tap((_) => this.clearLocalSession()),
      catchError((error) => {
        console.error('Falló el logout', error);
        throw error;
        })
    );
  }

  /**
   * Clear all the session data stored in the browser and notifies session listening components.
   */
  clearLocalSession() {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('isLoggedIn', 'false');
    
  }

  /**
   * Returns the local stored session obtained by the last "login" action.
   * @returns {any}
   */
    getCurrentSesion() {
    //const session = localStorage.getItem('currentSession');
    // return session ? JSON.parse(session) : null;
      return localStorage.getItem('currentSession');
    }

  /**
   * Return the local stored session state obtained by the last "login" action.
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }


  public startLocalSession(token: string) {
  localStorage.setItem('token', token);
  console.log('Token guardado en localStorage:', token);
  localStorage.setItem('currentSession', token);
  localStorage.setItem('isLoggedIn', 'true');
  }

getToken(): string | null {
  return localStorage.getItem('token');
}
}