// import {
//   HttpErrorResponse,
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { Inject, Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { AUTH_TOKEN } from './auth.token';
// import { SesionService } from './sesion.service';


// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(
//     @Inject(AUTH_TOKEN) 
//     private authToken: string, 
//     private router: Router, 
//     private sesion: SesionService
//     ) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (this.sesion.isLoggedIn()) {
//     //   if (!this.authToken) {
//     //         this.sesion.clearLocalSession();
//     //         this.router.navigate(['/login']);
//     //         return next.handle(req); // seguir sin token
//     //         }
//       const nuevaRequest = req.clone({
//         headers: req.headers.append('X-Authentication-Token', this.authToken)
//         // setHeaders: {
//         //   Authorization: `Bearer ${this.authToken}`
//         // }
//       });
//       return next.handle(nuevaRequest).pipe(
//         catchError((err: any) => {
//           if (err && err instanceof HttpErrorResponse) {
//             if (err.status === 401) {
//               return throwError(err);
//               // this.router.navigate(['']);
//             }
//             if (err.status === 500) {
//               return throwError(err);
//             }
//             if (err.status === 0) {
//               const Error0 = 0;
//               return throwError(Error0);
//             }
//           }
//           return throwError(err); // Propagar el error original en caso de otros códigos de error
//         })
//       );
//     } else {
//       return next.handle(req);
//     }
//   }
// }
