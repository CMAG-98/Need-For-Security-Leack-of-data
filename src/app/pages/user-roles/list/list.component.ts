import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/models/user-role.mode';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.mode';
import { UserRoleService } from 'src/app/services/user-role.service';
import { UserService } from 'src/app/services/user.service';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-role-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserRoleListComponent implements OnInit {
  userRoles: UserRole[] = [];
  users: User[] = [];
  roles: Role[] = [];

  constructor(
    private userRoleService: UserRoleService,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsersAndRoles();
  }

  loadUsersAndRoles(): void {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
        this.roleService.list().subscribe({
          next: (roles) => {
            this.roles = roles;
            this.list();
          },
          error: (err) => console.error('Error al cargar roles', err)
        });
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  list(): void {
    this.userRoleService.list().subscribe({
      next: (data) => {
        this.userRoles = data;
      },
      error: (err) => {
        console.error('Error al cargar roles de usuario', err);
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : 'Desconocido';
  }

  getRoleName(id: number): string {
    const role = this.roles.find(r => r.id === id);
    return role ? role.name : 'Desconocido';
  }

  create(): void {
    this.router.navigate(['/user-roles/create']);
  }

  view(id: string): void {
    this.router.navigate(['/user-roles/view/' + id]);
  }

  delete(id: string): void {
    Swal.fire({
      title: 'Eliminar asignación',
      text: '¿Está seguro de que desea eliminar este rol de usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userRoleService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La asignación fue eliminada.', 'success');
            this.list();
          },
          error: (err) => {
            console.error('Error al eliminar rol de usuario', err);
            Swal.fire('Error', 'No se pudo eliminar la asignación.', 'error');
          }
        });
      }
    });
  }
}
