import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Profile } from 'src/app/models/profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/services/security.service';
import { LogInUser } from 'src/app/models/log-in-user.mode';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
  profile: Profile | null = null; // Inicializar como null
  profileForm!: FormGroup;
  editMode: boolean = false;
  userId!: string;
  currentUser!: LogInUser;
  errorMessage: string = ''; // Para mostrar errores al usuario

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    // Obtenemos la información de localStorage directamente
    const sessionData = localStorage.getItem('sesion');
    if (sessionData) {
      try {
        const userSession = JSON.parse(sessionData);
        this.currentUser = userSession;
        this.userId = userSession.id;
        this.loadProfile();
      } catch (error) {
        console.error('Error al parsear la sesión de localStorage', error);
        this.errorMessage = 'Error al obtener información de sesión';
      }
    } else {
      this.errorMessage = 'No hay sesión activa';
    }
  }

  loadProfile(): void {
    const numericUserId: number = Number(this.userId);
    this.profileService.getByUserId(numericUserId).subscribe({
      next: (data: Profile) => {
        this.profile = data;
        this.initializeForm();
        this.errorMessage = ''; // Limpiar errores previos
      },
      error: (error) => {
        console.error('Error al obtener el perfil', error);
        this.errorMessage = 'Error al cargar el perfil. Verifique su conexión.';
      }
    });
  }

  initializeForm(): void {
    if (this.profile) {
      this.profileForm = this.fb.group({
        phone: [this.profile.phone, Validators.required],
        photo: [this.profile.photo, Validators.required]
      });
    }
  }

  enableEdit(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.profile && this.profileForm) {
      this.profileForm.patchValue({
        phone: this.profile.phone,
        photo: this.profile.photo
      });
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid && this.profile) {
      const updatedProfile: Profile = {
        ...this.profile,
        ...this.profileForm.value
      };
            
      this.profileService.update(updatedProfile).subscribe({
        next: (data: Profile) => {
          this.profile = data;
          this.editMode = false;
          // Si la foto del perfil se usa como avatar global, actualizamos también en SecurityService
          let currentUser = this.securityService.activeUserSession;
          if (currentUser) {
            currentUser.avatar = data.photo; // Actualizamos el avatar global
            this.securityService.setUser(currentUser);
          }
          this.errorMessage = ''; // Limpiar errores
        },
        error: (error) => {
          console.error('Error al actualizar el perfil', error);
          this.errorMessage = 'Error al actualizar el perfil. Intente nuevamente.';
        }
      });
    }
  }

  // Método para obtener el nombre del usuario para mostrar en el template
  getUserDisplayName(): string {
    return this.currentUser ? this.currentUser.name : 'Usuario no identificado';
  }

  // Método para obtener el email del usuario
  getUserEmail(): string {
    return this.currentUser ? this.currentUser.email : '';
  }
}