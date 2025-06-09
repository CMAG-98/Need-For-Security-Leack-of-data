import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/models/session';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  session: Session;
  sessionForm: FormGroup;
  trySend: boolean;

  // Simulamos el usuario actual; en un escenario real vendría de un servicio de autenticación.
  // Aquí se actualizará en función del parámetro de la URL (userId)
  currentUser: User = {
    id: 0,
    name: '',
    email: '',
    password: ''
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.trySend = false;
    // Inicializamos el objeto session
    this.session = { id: '', token: '', expiration: '', FACode: '', state: '' };
    this.configFormGroup();
  }

  ngOnInit(): void {
    // Determinar el modo de acuerdo a la URL (view, create o update)
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    // Si se invoqua desde el listado de usuarios para crear una sesión,
    // esperamos recibir un parámetro "userId"
    const userIdParam = this.activatedRoute.snapshot.params['userId'];
    if (userIdParam) {
      this.currentUser.id = Number(userIdParam);
    }


      const userId = this.currentUser.id!;
      const token = this.generateToken(userId);
      // Usar el método del servicio en lugar del local
      const expiration = this.sessionService.generateExpiration(1); // ← Cambio aquí
      this.sessionForm.patchValue({
        id: this.currentUser.id.toString(),
        token: token,
        expiration: expiration,
        state: 'activo'
      });


    // Para modos view o update, se espera recibir el id de la sesión (no del usuario)
    if (this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id && this.mode !== 2) {
      this.session.id = this.activatedRoute.snapshot.params.id;
      this.getSession(this.session.id);
    }
  }

  configFormGroup(): void {
    this.sessionForm = this.formBuilder.group({
      id: ['', Validators.required],
      token: ['', Validators.required],
      expiration: ['', Validators.required],
      FACode: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  get formControls() {
    return this.sessionForm.controls;
  }

  getSession(id: string): void {
    this.sessionService.view(id).subscribe({
      next: (response) => {
        this.session = response;
        this.sessionForm.patchValue({
          id: this.session.id,
          token: this.session.token,
          expiration: this.session.expiration,
          FACode: this.session.FACode,
          state: this.session.state
        });
      },
      error: (error) => console.error('Error al cargar la sesión:', error)
    });
  }

  // Genera un token "pequeño" basado en el id del usuario y la hora actual
  generateToken(userId: number): string {
    const rawToken = `${userId}-${Date.now()}`;
    return btoa(rawToken).substring(0, 8);
  }

// Genera una expiración en formato YYYY-MM-DD HH:MM:SS sumando la cantidad de horas indicada
generateExpiration(hours: number): string {
  const date = new Date(Date.now() + hours * 3600 * 1000);
  
  // Función auxiliar para rellenar con cero
  const pad = (num: number): string => (num < 10 ? '0' + num : num.toString());

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Los meses inician en 0
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

back(): void {
  // Usar el userId para regresar a la lista específica del usuario
  this.router.navigate(['/sessions/user', this.currentUser.id, 'list']);
}

create(): void {
  this.trySend = true;
  if (this.sessionForm.invalid) {
    Swal.fire({
      title: 'Error!',
      text: 'Por favor, complete todos los campos requeridos.',
      icon: 'error'
    });
    return;
  }

  const newSession = { ...this.sessionForm.value };
  newSession.expiration = this.normalizeDateForBackend(newSession.expiration);
  
  this.sessionService.create(newSession, this.currentUser.id!.toString()).subscribe({
    next: (session) => {
      Swal.fire({
        title: 'Creado!',
        text: 'Registro creado correctamente.',
        icon: 'success'
      });
      // Regresar a la lista del usuario específico
      this.router.navigate(['/sessions/user', this.currentUser.id, 'list']);
    },
    error: (error) => console.error('Error creando la sesión:', error)
  });
}

update(): void {
  this.trySend = true;
  if (this.sessionForm.invalid) {
    Swal.fire({
      title: 'Error!',
      text: 'Por favor, complete todos los campos requeridos.',
      icon: 'error'
    });
    return;
  }

  const sessionData = { ...this.sessionForm.value };
  sessionData.expiration = this.normalizeDateForBackend(sessionData.expiration);
  
  console.log('Enviando sesión con fecha normalizada:', sessionData);
  
  this.sessionService.update(sessionData).subscribe({
    next: (session) => {
      Swal.fire({
        title: 'Actualizado!',
        text: 'Registro actualizado correctamente.',
        icon: 'success'
      });
      // Regresar a la lista del usuario específico
      this.router.navigate(['/sessions/user', this.currentUser.id, 'list']);
    },
    error: (error) => console.error('Error actualizando la sesión:', error)
  });
}
  private normalizeDateForBackend(dateValue: any): string {
  if (!dateValue) return '';
  
  // Si ya tiene el formato correcto, devolverlo tal como está
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // Convertir cualquier formato a Date y luego al formato que espera el backend
  const date = new Date(dateValue);
  
  const pad = (num: number): string => (num < 10 ? '0' + num : num.toString());

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
}