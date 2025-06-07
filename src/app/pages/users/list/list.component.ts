import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.userService.list().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  create(): void {
    this.router.navigate(['/users/create']);
  }

  view(id: number): void {
    this.router.navigate(['/users/view/' + id]);
  }

  edit(id: number): void {
    this.router.navigate(['/users/update/' + id]);
  }

  viewPasswords(id: number): void {
    this.router.navigate(['/passwords/user', id]);
  }

  viewAddress(userId: number): void {
    this.router.navigate(['/address/user', userId]);
  }
  viewRoles(userId: number): void {
    this.router.navigate(['/users/user-roles/user', userId]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar usuario',
      text: '¿Está seguro de que desea eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            this.list();
          },
          error: (err) => {
            console.error('Error al eliminar usuario', err);
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        });
      }
    });
  }
}
