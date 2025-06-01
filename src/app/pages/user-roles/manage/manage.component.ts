import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.mode';
import { UserRole } from 'src/app/models/user-role.mode';
import { UserRoleService } from 'src/app/services/user-role.service';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-role-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class UserRoleManageComponent implements OnInit {
  userRoles: UserRole[] = [];
  users: User[] = [];
  roles: Role[] = [];

  userRole: UserRole | null = null;
  theFormGroup: FormGroup;

  mode: number = 0; // 1=ver, 2=crear, 3=editar
  trySend: boolean = false;

  selectedUserName: string = '';
  selectedRoleName: string = '';

  constructor(
    private fb: FormBuilder,
    private userRoleService: UserRoleService,
    private userService: UserService,
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.theFormGroup = this.fb.group({
      id: [''],
      id_user: ['', Validators.required],
      id_role: ['', Validators.required],
      startAt: ['', Validators.required],
      endAt: ['']
    });
  }

  ngOnInit() {
    // Cargo usuarios y roles en paralelo
    forkJoin({
      users: this.userService.list(),
      roles: this.roleService.list()
    }).subscribe({
      next: ({ users, roles }) => {
        this.users = users;
        this.roles = roles;

        // Defino el modo después de cargar users y roles
        const currentUrl = this.activatedRoute.snapshot.url.join('/');
        if (currentUrl.includes('view')) {
          this.mode = 1;
        } else if (currentUrl.includes('create')) {
          this.mode = 2;
        } else if (currentUrl.includes('update')) {
          this.mode = 3;
        }

        this.updateFormState();

        const userRoleId = this.activatedRoute.snapshot.params.id;
        if (userRoleId) {
          this.getUserRole(userRoleId);
        }
      },
      error: (err) => {
        console.error('Error cargando usuarios o roles:', err);
      }
    });
  }

  getUserRole(id: string) {
    this.userRoleService.view(id).subscribe({
      next: (response: UserRole) => {
        this.userRole = response;

        this.theFormGroup.patchValue({
          id: response.id,
          id_user: response.id_user,
          id_role: response.id_role,
          startAt: this.formatDateToInputString(response.startAt),
          endAt: response.endAt ? this.formatDateToInputString(response.endAt) : ''
        });

        this.updateSelectedUserAndRoleNames();

        this.updateFormState();
      },
      error: (error) => {
        console.error('Error al obtener el rol de usuario:', error);
      }
    });
  }

  updateSelectedUserAndRoleNames() {
    if (!this.userRole) {
      this.selectedUserName = '';
      this.selectedRoleName = '';
      return;
    }

    const user = this.users.find(u => u.id === this.userRole!.id_user);
    const role = this.roles.find(r => r.id === this.userRole!.id_role);

    this.selectedUserName = user ? user.name : 'Desconocido';
    this.selectedRoleName = role ? role.name : 'Desconocido';
  }

  private formatDateToInputString(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  updateFormState() {
    if (this.mode === 1) {
      this.theFormGroup.disable();
    } else {
      this.theFormGroup.enable();
    }
  }

  back() {
    this.router.navigate(['/user-roles/list']);
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    const formValue = this.theFormGroup.value;
    const userId = formValue.id_user;
    const roleId = formValue.id_role;

    console.log('📤 Datos enviados al backend:', formValue);

    this.userRoleService.create(formValue, userId, roleId).subscribe({
      next: () => {
        Swal.fire('Creado', 'Rol de usuario creado correctamente.', 'success');
        this.router.navigate(['/user-roles/list']);
      },
      error: (err) => console.error(err)
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.userRoleService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Rol de usuario actualizado correctamente.', 'success');
        this.router.navigate(['/user-roles/list']);
      },
      error: (err) => console.error(err)
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }
}
