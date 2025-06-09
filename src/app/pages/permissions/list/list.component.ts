import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from 'src/app/models/permission.model';
import { PermissionService } from 'src/app/services/permission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  permissions: Permission[] = [];
  loading: boolean = false;

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.loading = true;
    this.permissionService.list().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar permisos', err);
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los permisos.',
          icon: 'error'
        });
      }
    });
  }

  create(): void {
    this.router.navigate(['/permissions/create']);
  }

  view(id: number): void {
    this.router.navigate(['/permissions/view/' + id]);
  }

  edit(id: number): void {
    this.router.navigate(['/permissions/update/' + id]);
  }

  delete(id: number): void {
    // Encontrar el permiso para mostrar más información
    const permission = this.permissions.find(p => p.id === id);
    const entityInfo = permission ? `${permission.entity} (${permission.method} ${permission.url})` : 'este permiso';

    Swal.fire({
      title: 'Eliminar permiso',
      html: `¿Está seguro de que desea eliminar el permiso:<br><strong>${entityInfo}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.permissionService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El permiso ha sido eliminado correctamente.',
              icon: 'success',
              timer: 2000
            });
            this.list(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al eliminar permiso', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el permiso. Inténtelo nuevamente.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  // Método para obtener el nombre legible de la entidad
  getEntityLabel(entity: string): string {
    const entityMap: { [key: string]: string } = {
      'User': 'Usuarios',
      'Session': 'Sesiones',
      'Password': 'Contraseñas',
      'Device': 'Dispositivos',
      'SecurityQuestion': 'Preguntas de seguridad',
      'Answer': 'Respuestas',
      'DigitalSignature': 'Firmas digitales',
      'Address': 'Direcciones',
      'Profile': 'Perfiles',
      'Role': 'Roles',
      'UserRole': 'Roles de usuario',
      'Permission': 'Permisos',
      'RolePermission': 'Permisos de rol'
    };
    return entityMap[entity] || entity;
  }
}