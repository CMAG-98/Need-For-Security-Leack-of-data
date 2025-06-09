import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/models/profile';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  profile: Profile = { id: 0, phone: '', photo: '' };
  name = '';
  email = '';
  photo = '';
  phone = '';
  userId: string = '';
  
  // Modo del componente: 1 = view, 3 = update
  mode: number = 1;
  
  // Variables para el modo edición
  editPhone = '';
  selectedFile: File | null = null;
  previewUrl: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Determinar el modo de acuerdo a la URL
    const currentUrl = this.route.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1; // Modo vista
    } else if (currentUrl.includes('update')) {
      this.mode = 3; // Modo edición
    }

    // Obtener el userId de la ruta
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    
    this.loadUserData();
  }

  loadUserData(): void {
    const sessionStr = localStorage.getItem('sesion');
    
    if (sessionStr) {
      const ses = JSON.parse(sessionStr);
      
      // Obtener datos directamente del localStorage
      this.name = ses.name || '';
      this.email = ses.email || '';
      this.phone = ses.phone || '';
      this.photo = ses.avatar || '';
      
      // Para modo edición, inicializar campos editables
      if (this.mode === 3) {
        this.editPhone = this.phone;
        this.previewUrl = this.photo;
      }
      
      // Llenar el objeto profile
      this.profile = {
        id: Number(ses.id) || 0,
        phone: this.phone,
        photo: this.photo
      };

      console.log('Datos cargados - Modo:', this.mode === 1 ? 'Vista' : 'Edición', {
        name: this.name,
        email: this.email,
        photo: this.photo,
        phone: this.phone,
        userId: this.userId
      });
    } else {
      // Si no hay sesión, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  // Manejar selección de archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Archivo inválido',
        text: 'Por favor selecciona un archivo de imagen válido.',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  // Guardar cambios (modo edición)
  saveChanges(): void {
    if (this.mode !== 3) return;

    // Validaciones básicas
    if (!this.editPhone.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El teléfono es requerido.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Mostrar loading
    Swal.fire({
      title: 'Guardando cambios...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      // Actualizar datos en localStorage
      const sessionStr = localStorage.getItem('sesion');
      if (sessionStr) {
        const ses = JSON.parse(sessionStr);
        
        // Actualizar teléfono
        ses.phone = this.editPhone.trim();
        
        // Actualizar avatar si se seleccionó una nueva imagen
        if (this.selectedFile && this.previewUrl) {
          ses.avatar = this.previewUrl;
        }
        
        // Guardar en localStorage
        localStorage.setItem('sesion', JSON.stringify(ses));
        
        // Actualizar variables locales
        this.phone = ses.phone;
        this.photo = ses.avatar;
        this.profile.phone = this.phone;
        this.profile.photo = this.photo;
        
        Swal.fire({
          icon: 'success',
          title: '¡Perfil actualizado!',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#28a745'
        }).then(() => {
          // Redirigir a modo vista
          this.router.navigate(['/profiles/user', this.userId, 'view']);
        });
      }
    }, 1000);
  }

  // Cancelar edición
  cancelEdit(): void {
    // Redirigir a modo vista sin guardar cambios
    this.router.navigate(['/profiles/user', this.userId, 'view']);
  }

  deleteProfile(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu perfil permanentemente y no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('sesion');
        
        Swal.fire({
          icon: 'success',
          title: 'Perfil eliminado',
          text: 'Tu perfil ha sido eliminado correctamente.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  editProfile(): void {
    // Navegar a modo edición
    if (this.userId) {
      this.router.navigate(['/profiles/user', this.userId, 'update']);
    } else {
      const sessionStr = localStorage.getItem('sesion');
      if (sessionStr) {
        const ses = JSON.parse(sessionStr);
        const id = ses.id || this.profile.id;
        this.router.navigate(['/profiles/user', id, 'update']);
      }
    }
  }

  // Método para obtener el título según el modo
  getTitle(): string {
    return this.mode === 3 ? 'Editar Perfil' : 'Ver Perfil';
  }

  // Método para verificar si está en modo vista
  isViewMode(): boolean {
    return this.mode === 1;
  }

  // Método para verificar si está en modo edición
  isEditMode(): boolean {
    return this.mode === 3;
  }
}