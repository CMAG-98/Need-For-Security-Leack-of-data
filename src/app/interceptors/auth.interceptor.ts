import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let theUser = this.securityService.activeUserSession;
    const token = theUser ? theUser["token"] : null;

    // No agregar token en solicitudes OPTIONS ni en rutas de login o validación de token
    if (
      request.method === 'OPTIONS' ||
      request.url.includes('/login') ||
      request.url.includes('/token-validation')
    ) {
      console.log("No se pone token para esta solicitud:", request.method, request.url);
      return next.handle(request);
    } else {
      console.log("Colocando token en solicitud:", request.method, request.url);

      // Clonar la solicitud y agregar el header Authorization
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authRequest).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            Swal.fire({
              title: 'No está autorizado para esta operación',
              icon: 'error',
              timer: 5000
            });
            this.router.navigateByUrl('/dashboard');
          } else if (err.status === 400) {
            Swal.fire({
              title: 'Existe un error, contacte al administrador',
              icon: 'error',
              timer: 5000
            });
          }

          return throwError(() => err);
        })
      );
    }
  }
}
