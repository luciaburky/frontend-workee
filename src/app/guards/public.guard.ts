import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../interceptors/sesion.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);

  if (sesionService.isLoggedIn()) {
    
    sesionService.setLoading(true);
    
    if (sesionService.redirectUrl) {
      router.navigateByUrl(sesionService.redirectUrl);
    } else {
      sesionService.cargarRolUsuario();
    }
    return false; 
  }

  // Si no está logueado, permite el acceso.
  sesionService.setLoading(false);
  return true;
};
