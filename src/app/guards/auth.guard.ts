import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../interceptors/sesion.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);

  // Si la sesión está activa, permite el acceso a la ruta.
  if (sesionService.isLoggedIn()) {
    sesionService.redirectUrl = state.url;
    return true;
  }

  // Si no está logueado, redirige a la página de login.
  sesionService.redirectUrl = state.url;
  router.navigate(['/login']);
  return false;


  

};
