import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { RolService } from '../modulos/seguridad/usuarios/rol.service';
import { Rol } from '../modulos/seguridad/rol';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SesionService {
  redirectUrl: string = '';

  // Log In Event dispatcher
  private announceSource = new Subject<string>();
  // For login subscribers.
  announced$ = this.announceSource.asObservable();

  private rolUsuarioSubject = new BehaviorSubject<Rol | null>(null);
  rolUsuario$ = this.rolUsuarioSubject.asObservable();

  private endpointURL = 'http://localhost:9090/auth';

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private rolService: RolService,
    private router: Router
  ) {}

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

  clearLocalSession(): void {
    // Limpia local y session storage de forma SSR-safe
    this.storage.clearAll();
    // Después de limpiar todo, seteamos el flag (si estamos en browser esto persiste)
    this.storage.setItem('isLoggedIn', 'false');
    // Si tenés listeners de sesión, podrías emitir algo:
    this.announceSource.next('logout');
  }


  getCurrentSesion(): string | null {
    // En tu código guardás el token en currentSession (string). Si fuera JSON, acá lo parseás.
    return this.storage.getItem('currentSession');
  }

  isLoggedIn(): boolean {
    return this.storage.getItem('isLoggedIn') === 'true';
  }

  startLocalSession(token: string): void {
    this.storage.setItem('token', token);
    this.storage.setItem('currentSession', token);
    this.storage.setItem('isLoggedIn', 'true');
    // Podés notificar a subscriptores que hay login:
    this.announceSource.next('login');
  }

  
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

    cargarRolUsuario(): void {
      this.setLoading(true);
      const correo = this.getCorreoUsuario();
      if (!correo) {
        this.setLoading(false);
        console.error("No se pudo obtener el correo del token.");
        return;
      }

      this.rolService.buscarRolPorCorreoUsuario(correo).subscribe({
        next: (rol) => {
          this.rolUsuarioSubject.next(rol); 
          console.log("Rol del usuario cargado:", rol);
          this.redirectBasedOnRol();
          this.setLoading(false);
        },
        error: (err) => {
          console.error("Error al obtener rol del usuario:", err);
          this.rolUsuarioSubject.next(null);
          this.setLoading(false);
        }
      });
  }

  getRolActual(): Rol | null {
    console.log("el rol actual es: ", this.rolUsuarioSubject.value)

    return this.rolUsuarioSubject.value;
  }


  // Nuevo método para redirigir según el rol
  redirectBasedOnRol(): void {
    const rolActual = this.getRolActual();

    if (!rolActual) {
      console.warn('Rol o payload no disponibles. Redirigiendo a página por defecto.');
      this.router.navigate(['/buscar-empresas']);
      return;
    }

    // Aquí es donde ocurre la magia de la redirección
    switch (rolActual.codigoRol) {
      case 'CANDIDATO':
        this.router.navigate(['/candidato/perfil']);
        break;
      case 'EMPLEADO_EMPRESA':
        this.router.navigate(['/empleados/perfil']);
        break;
      case 'ADMIN_EMPRESA':
        this.router.navigate(['/empresas/perfil']);
        break;
      case 'ADMIN_SISTEMA':
        this.router.navigate(['/usuarios']);
        break;
      default:
        console.warn('Rol no reconocido, redirigiendo a la página por defecto.');
        this.router.navigate(['/']);
    }
  }

  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }

}
