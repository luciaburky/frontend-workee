import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../interceptors/sesion.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const sesionService = inject(SesionService);
  const router = inject(Router);

  // Si la sesión está activa, redirige al dashboard.
  if (sesionService.isLoggedIn()) {
    sesionService.setLoading(true);
    sesionService.cargarRolUsuario();
    return false; 
  }

  // Si no está logueado, permite el acceso.
  return true;
};
