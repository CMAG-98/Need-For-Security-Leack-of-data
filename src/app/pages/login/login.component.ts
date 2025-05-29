import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

declare const google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
    user: User;
    googleInitialized = false;
  
    constructor(
      private securityService: SecurityService,
      private router: Router
    ) {
      this.user = { email: "", password: "" };
    }
  
    ngOnInit(): void {
      const CLIENT_ID = "748495779149-lqrjhm1ncd6qrvsf67bt2s7sbu2vi900.apps.googleusercontent.com";
  
      const initGoogle = () => {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response: any) => this.handleCredentialResponse(response),
          ux_mode: "popup"  // Manteniendo popup para evitar redirect
        });
        this.googleInitialized = true;
  
        google.accounts.id.renderButton(
          document.getElementById("googleButtonContainer"),
          {
            theme: "outline",
            size: "large",
            width: 240,
            text: "signup_with",
          }
        );
      };
  
      if (typeof google === 'undefined' || !google.accounts?.id) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.head.appendChild(script);
      } else {
        initGoogle();
      }
    }
  
    handleCredentialResponse(response: any): void {
      const googleToken = response.credential;
  
      this.securityService.validateGoogleToken(googleToken)
        .then(profile => {
          const googleUser: User = {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            password: '',
            avatar: profile.picture,
            token: googleToken,
          };
  
          console.log("Usuario registrado con Google:", googleUser);
  
          this.securityService.saveSession({ user: googleUser, token: googleToken });
  
          // Delay para evitar problemas visuales en la navegación
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 50);
        })
        .catch(error => {
          console.error('Token Google inválido', error);
          Swal.fire("Error", "Token de Google inválido", "error");
        });
    }
  
    loginWithGoogle(): void {
      if (!this.googleInitialized || typeof google === 'undefined') {
        console.error('Google SDK no está inicializado');
        Swal.fire("Error", "El SDK de Google no está listo. Intenta recargar la página.", "error");
        return;
      }
      try {
        google.accounts.id.prompt();
      } catch (err) {
        console.error('Error al mostrar prompt de Google:', err);
        Swal.fire("Error", "No se pudo iniciar sesión con Google en este momento.", "error");
      }
    }
  
    ngOnDestroy(): void {
      // Limpieza si fuera necesario
    }
}
