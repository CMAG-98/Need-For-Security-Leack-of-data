import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/role.mode';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];

  constructor(
    private roleService: RoleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.roleService.list().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/roles/create']);
  }

  viewUsers(roleId: number): void{
    this.router.navigate(['/roles/user-roles/'+ roleId])
  }

  view(id: number): void {
    this.router.navigate(['/roles/view/' + id]);
  }

  viewPermissions(roleId: number): void {
    this.router.navigate(['/role-permissions/permissions-by-role', roleId]);
  }

  edit(id: number): void {
    this.router.navigate(['/roles/update/' + id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar rol',
      text: '¿Está seguro de que desea eliminar este rol?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El rol ha sido eliminado.', 'success');
            this.list();
          },
          error: (err) => {
            console.error('Error al eliminar rol', err);
            Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
          }
        });
      }
    });
  }
}
