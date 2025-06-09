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
  userRole: UserRole | null = null;
  users: User[] = [];
  roles: Role[] = [];

  theFormGroup: FormGroup;
  mode: number = 0; // 1=ver, 2=crear
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
      endAt: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    forkJoin({
      users: this.userService.list(),
      roles: this.roleService.list()
    }).subscribe({
      next: ({ users, roles }) => {
        this.users = users;
        this.roles = roles;

        const userRoleId = this.activatedRoute.snapshot.params.id;
        if (userRoleId) {
          this.getUserRole(userRoleId);
          this.mode = 1; // Solo ver si hay id
        } else {
          this.mode = 2; // Crear
          this.updateFormState();
        }

        // Actualizar nombres visibles al cambiar selects
        this.theFormGroup.get('id_user')?.valueChanges.subscribe(() => this.updateSelectedUserAndRoleNames());
        this.theFormGroup.get('id_role')?.valueChanges.subscribe(() => this.updateSelectedUserAndRoleNames());
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
    const userId = this.theFormGroup.get('user_id')?.value;
    const roleId = this.theFormGroup.get('role_id')?.value;

    const user = this.users.find(u => u.id === userId);
    const role = this.roles.find(r => r.id === roleId);

    this.selectedUserName = user ? user.name : '';
    this.selectedRoleName = role ? role.name : '';
  }

  private formatDateToInputString(date: Date | string): string {
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

    this.userRoleService.create(formValue, userId, roleId).subscribe({
      next: () => {
        Swal.fire('Creado', 'Rol de usuario creado correctamente.', 'success');
        this.router.navigate(['/user-roles/list']);
      },
      error: (err) => console.error(err)
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }
}
