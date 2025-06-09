import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Permission } from 'src/app/models/permission.model';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  permission: Permission;
  permissionForm: FormGroup;
  trySend: boolean = false;

  // Lista de entidades disponibles para asignar permisos
  entities: { value: string, label: string, entity: string }[] = [
    { value: '/users', label: 'Usuarios', entity: 'User' },
    { value: '/sessions', label: 'Sesiones', entity: 'Session' },
    { value: '/passwords', label: 'Contraseñas', entity: 'Password' },
    { value: '/devices', label: 'Dispositivos', entity: 'Device' },
    { value: '/security-questions', label: 'Preguntas de seguridad', entity: 'SecurityQuestion' },
    { value: '/answers', label: 'Respuestas', entity: 'Answer' },
    { value: '/digital-signatures', label: 'Firmas digitales', entity: 'DigitalSignature' },
    { value: '/addresses', label: 'Direcciones', entity: 'Address' },
    { value: '/profiles', label: 'Perfiles', entity: 'Profile' },
    { value: '/roles', label: 'Roles', entity: 'Role' },
    { value: '/user-roles', label: 'Roles de usuario', entity: 'UserRole' },
    { value: '/permissions', label: 'Permisos', entity: 'Permission' },
    { value: '/role-permissions', label: 'Permisos de rol', entity: 'RolePermission' }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Inicializamos el objeto permission con valores por defecto
    this.permission = { id: 0, url: '', method: '', entity: '' };
    this.configFormGroup();
  }

  ngOnInit(): void {
    // Determinamos el modo según la URL
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    // En modos view o update, se espera recibir el id del permiso para consultarlo
    if (this.mode !== 2 && this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.id) {
      const id = Number(this.activatedRoute.snapshot.params.id);
      this.getPermission(id);
    } else {
      // En modo creación, se establece un valor predeterminado
      if (this.entities.length > 0) {
        this.permissionForm.patchValue({
          entity: this.entities[0].entity,
          url: this.entities[0].value,
          method: 'GET'
        });
      }
    }
  }

  configFormGroup(): void {
    this.permissionForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      entity: ['', Validators.required],
      method: ['', Validators.required],
      url: ['', Validators.required]
    });

    // Listener para sincronizar entity con url
    this.permissionForm.get('entity')?.valueChanges.subscribe(selectedEntity => {
      if (selectedEntity && this.mode === 2) { // Solo en modo creación
        this.onEntityChange(selectedEntity);
      }
    });
  }

  get formControls() {
    return this.permissionForm.controls;
  }

  // Método para manejar el cambio de entidad
  onEntityChange(selectedEntity: string): void {
    const entityData = this.entities.find(e => e.entity === selectedEntity);
    if (entityData) {
      this.permissionForm.patchValue({
        url: entityData.value
      });
    }
  }

  getPermission(id: number): void {
    this.permissionService.getById(id).subscribe({
      next: (response) => {
        this.permission = response;
        
        // Debug: Verificar qué datos llegan
        console.log('Datos del permiso cargado:', this.permission);
        console.log('Entidades disponibles:', this.entities);
        
        // Buscar la entidad correspondiente basándose en la URL o en el entity
        let matchedEntity = this.entities.find(e => 
          e.entity === this.permission.entity || 
          e.value === this.permission.url
        );
        
        if (!matchedEntity) {
          console.warn('No se encontró coincidencia exacta, buscando por URL parcial...');
          // Si no hay coincidencia exacta, buscar por URL parcial
          matchedEntity = this.entities.find(e => 
            this.permission.url.includes(e.value) || 
            e.value.includes(this.permission.url)
          );
        }
        
        console.log('Entidad encontrada:', matchedEntity);
        
        // Actualizar el formulario con los datos del permiso
        this.permissionForm.patchValue({
          id: this.permission.id,
          entity: matchedEntity ? matchedEntity.entity : this.permission.entity,
          method: this.permission.method,
          url: this.permission.url
        });

        // Configurar los estados de los campos según el modo
        this.configureFieldStates();
      },
      error: (err) => {
        console.error('Error al cargar el permiso:', err);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cargar el permiso.',
          icon: 'error'
        });
      }
    });
  }

  // Configurar el estado de los campos según el modo
  configureFieldStates(): void {

    if (this.mode === 1) {
      // Modo view: todos los campos deshabilitados
      this.permissionForm.get('entity')?.disable();
      this.permissionForm.get('method')?.disable();
      this.permissionForm.get('url')?.disable();
    } else if (this.mode === 3) {
      // Modo update: solo entity y url deshabilitados, method habilitado
      this.permissionForm.get('entity')?.disable();
      this.permissionForm.get('url')?.disable();
      this.permissionForm.get('method')?.enable();
    } else {
      // Modo create: todos habilitados excepto url que se actualiza automáticamente
      this.permissionForm.get('entity')?.enable();
      this.permissionForm.get('method')?.enable();
      this.permissionForm.get('url')?.disable(); // Se actualiza automáticamente
    }
    
    console.log('Estados de campos configurados');
  }

  save(): void {
    this.trySend = true;
    
    // Habilitar temporalmente los campos deshabilitados para obtener sus valores
    const entityControl = this.permissionForm.get('entity');
    const urlControl = this.permissionForm.get('url');
    const methodControl = this.permissionForm.get('method');
    
    const wasEntityDisabled = entityControl?.disabled;
    const wasUrlDisabled = urlControl?.disabled;
    const wasMethodDisabled = methodControl?.disabled;
    
    if (wasEntityDisabled) entityControl?.enable();
    if (wasUrlDisabled) urlControl?.enable();
    if (wasMethodDisabled) methodControl?.enable();

    if (this.permissionForm.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error'
      });
      
      // Restaurar estados originales
      if (wasEntityDisabled) entityControl?.disable();
      if (wasUrlDisabled) urlControl?.disable();
      if (wasMethodDisabled) methodControl?.disable();
      
      return;
    }

    const permissionData: Permission = {
      id: this.permission.id,
      entity: this.permissionForm.get('entity')?.value,
      method: this.permissionForm.get('method')?.value,
      url: this.permissionForm.get('url')?.value
    };

    // Restaurar estados originales
    if (wasEntityDisabled) entityControl?.disable();
    if (wasUrlDisabled) urlControl?.disable();
    if (wasMethodDisabled) methodControl?.disable();

    if (this.mode === 2) {
      // Crear un nuevo permiso
      this.permissionService.create(permissionData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Creado!',
            text: 'Permiso creado correctamente.',
            icon: 'success'
          });
          this.router.navigate(['/permissions/list']);
        },
        error: (err) => {
          console.error('Error al crear permiso:', err);
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo crear el permiso.',
            icon: 'error'
          });
        }
      });
    } else if (this.mode === 3) {
      // Actualizar el permiso existente
      this.permissionService.update(this.permission.id, permissionData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Actualizado!',
            text: 'Permiso actualizado correctamente.',
            icon: 'success'
          });
          this.router.navigate(['/permissions/list']);
        },
        error: (err) => {
          console.error('Error al actualizar permiso:', err);
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo actualizar el permiso.',
            icon: 'error'
          });
        }
      });
    }
  }

  back(): void {
    this.router.navigate(['/permissions/list']);
  }

}