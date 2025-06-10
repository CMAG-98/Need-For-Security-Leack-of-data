import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/services/permission.service';
import { RoleService } from 'src/app/services/role.service';

interface Permission {
  id: number;
  entity: string;
  method: string;
  has_permission: boolean;
  url: string;
  created_at?: string;
  updated_at?: string;
}

interface GroupedPermission {
  entity: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-permissionsbyrole',
  templateUrl: './permissionsbyrole.component.html',
  styleUrls: ['./permissionsbyrole.component.scss']
})
export class PermissionsbyroleComponent implements OnInit {
  roleId: number;
  roleName: string = '';
  groupedPermissions: GroupedPermission[] = [];
  loading: boolean = true;
  noPermissionsFound: boolean = false;

  // Todas las entidades que deben aparecer siempre
  allEntities: string[] = [
    'User',
    'Users', 
    'Role',
    'Answer',
    'Session',
    'password',
    'device',
    'securityQuestion',
    'digitalSignature',
    'address',
    'profile',
    'userRole',
    'permissions',
    'rolePermission'
  ];

  // Métodos que siempre deben aparecer (cambiados a acciones descriptivas)
  requiredMethods: string[] = ['VIEW', 'LIST', 'CREATE', 'UPDATE', 'DELETE'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleId = Number(this.activatedRoute.snapshot.params['id']);
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Cargar nombre del rol
    this.roleService.view(this.roleId).subscribe({
      next: (role) => {
        this.roleName = role.name;
      },
      error: (err) => {
        console.error('Error al obtener el rol:', err);
        this.roleName = `Rol ${this.roleId}`;
      }
    });
    
    // Cargar permisos agrupados
    this.permissionService.getGroupedByRole(this.roleId).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        
        if (response && response.length > 0) {
          this.groupedPermissions = this.processPermissions(response);
          this.noPermissionsFound = false;
        } else {
          this.groupedPermissions = [];
          this.noPermissionsFound = true;
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar permisos:', err);
        this.groupedPermissions = [];
        this.noPermissionsFound = true;
        this.loading = false;
      }
    });
  }
  
  processPermissions(backendData: any[]): GroupedPermission[] {
    const processedGroups: GroupedPermission[] = [];
    
    // Procesar TODAS las entidades, no solo las que vienen del backend
    this.allEntities.forEach(entityName => {
      const backendGroup = backendData.find(group => group.entity === entityName);
      
      const processedGroup: GroupedPermission = {
        entity: entityName,
        permissions: []
      };
      
      // Asegurar que todos los métodos requeridos estén presentes
      this.requiredMethods.forEach(method => {
        let existingPermission;
        
        if (backendGroup && backendGroup.permissions) {
          existingPermission = backendGroup.permissions.find((p: any) => p.method === method);
        }
        
        if (existingPermission) {
          processedGroup.permissions.push({
            id: existingPermission.id,
            entity: existingPermission.entity,
            method: existingPermission.method,
            has_permission: existingPermission.has_permission,
            url: existingPermission.url || this.generateUrl(entityName, method),
            created_at: existingPermission.created_at,
            updated_at: existingPermission.updated_at
          });
        } else {
          // Crear permiso faltante con has_permission = false y id temporal
          processedGroup.permissions.push({
            id: 0, // ID temporal para permisos nuevos
            entity: entityName,
            method: method,
            has_permission: false,
            url: this.generateUrl(entityName, method)
          });
        }
      });
      
      processedGroups.push(processedGroup);
    });
    
    return processedGroups;
  }
  
  generateUrl(entity: string, method: string): string {
    const entityLower = entity.toLowerCase();
    switch(method) {
      case 'VIEW':
        return `/${entityLower}/view`;
      case 'LIST':
        return `/${entityLower}/list`;
      case 'CREATE':
        return `/${entityLower}/create`;
      case 'UPDATE':
        return `/${entityLower}/update`;
      case 'DELETE':
        return `/${entityLower}/delete`;
      default:
        return `/${entityLower}`;
    }
  }
  
  togglePermission(groupIndex: number, method: string): void {
    const permission = this.groupedPermissions[groupIndex].permissions.find(p => p.method === method);
    if (permission) {
      permission.has_permission = !permission.has_permission;
      console.log(`Permiso '${method}' para '${this.groupedPermissions[groupIndex].entity}' cambiado a: ${permission.has_permission}`);
    }
  }

  getPermissionByMethod(group: GroupedPermission, method: string): Permission | undefined {
    return group.permissions.find(p => p.method === method);
  }

  // Crear estructura de permisos por defecto
  createDefaultPermissions(): void {
    // Aquí podrías llamar a un endpoint para crear permisos por defecto
    // Por ahora, crear estructura vacía local
    this.groupedPermissions = [];
    this.noPermissionsFound = false;
    
    Swal.fire({
      title: 'Permisos creados',
      text: 'Se ha creado la estructura de permisos.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  // Guardar cambios - versión actualizada usando updatePermission individual
  saveChanges(): void {
    const permissionsToUpdate = this.getPermissionsToUpdate();
    
    if (permissionsToUpdate.length === 0) {
      Swal.fire({
        title: 'Sin cambios',
        text: 'No hay permisos para actualizar.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
      return;
    }

    console.log('Permisos a actualizar:', permissionsToUpdate);
    
    // Mostrar loading
    Swal.fire({
      title: 'Guardando...',
      text: 'Actualizando permisos...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Procesar cada permiso individualmente
    this.updatePermissionsSequentially(permissionsToUpdate, 0);
  }

  // Método para actualizar permisos de forma secuencial
  private updatePermissionsSequentially(permissions: Permission[], index: number): void {
    if (index >= permissions.length) {
      // Todas las actualizaciones completadas
      this.loadData(); // Recargar datos
      
      Swal.fire({
        title: 'Guardado exitoso',
        text: 'Los permisos se han actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      return;
    }

    const permission = permissions[index];
    
    // Si el permiso tiene ID (existe), actualizarlo
    if (permission.id > 0) {
      this.permissionService.update(permission.id, {
        id: permission.id,
        has_permission: permission.has_permission,
        url: permission.url,
        method: permission.method,
        entity: permission.entity
      }).subscribe({
        next: (response) => {
          console.log(`Permiso ${permission.id} actualizado:`, response);
          // Continuar con el siguiente
          this.updatePermissionsSequentially(permissions, index + 1);
        },
        error: (error) => {
          console.error(`Error al actualizar permiso ${permission.id}:`, error);
          this.handleUpdateError(error);
        }
      });
    } else {
      // Si no tiene ID, es un permiso nuevo - podrías crear uno nuevo si tienes ese servicio
      // O simplemente continuar con el siguiente
      console.log('Permiso nuevo ignorado (sin ID):', permission);
      this.updatePermissionsSequentially(permissions, index + 1);
    }
  }

  // Obtener solo los permisos que necesitan ser actualizados
  private getPermissionsToUpdate(): Permission[] {
    const permissionsToUpdate: Permission[] = [];
    
    this.groupedPermissions.forEach(group => {
      group.permissions.forEach(permission => {
        // Solo incluir permisos que existen en el backend (tienen ID > 0)
        if (permission.id > 0) {
          permissionsToUpdate.push(permission);
        }
      });
    });
    
    return permissionsToUpdate;
  }

  // Manejar errores de actualización
  private handleUpdateError(error: any): void {
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al actualizar los permisos.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  // Verificar si hay permisos cargados
  hasPermissions(): boolean {
    return this.groupedPermissions.length > 0;
  }
}