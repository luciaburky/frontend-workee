import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SesionService } from './sesion.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const sesionService = inject(SesionService);
  const token = sesionService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
