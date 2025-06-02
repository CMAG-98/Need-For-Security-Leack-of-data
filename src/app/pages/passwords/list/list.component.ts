import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Password } from 'src/app/models/password.mode';
import { User } from 'src/app/models/user.model';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PasswordListComponent implements OnInit {
  passwords: Password[] = [];

  constructor(
    private passwordService: PasswordService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.passwordService.list().subscribe({
      next: (data) => {
        this.passwords = data;
      },
      error: (err) => {
        console.error('Error al cargar contraseñas', err);
      }
    });
  }


  create(): void {
    this.router.navigate(['/passwords/create']);
  }

  view(id: number): void {
    this.router.navigate(['/passwords/view/' + id]);
  }

  edit(id: number): void {
    this.router.navigate(['/passwords/update/' + id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar contraseña',
      text: '¿Está seguro de que desea eliminar esta contraseña?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.passwordService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La contraseña fue eliminada.', 'success');
            this.list();
          },
          error: (err) => {
            console.error('Error al eliminar contraseña', err);
            Swal.fire('Error', 'No se pudo eliminar la contraseña.', 'error');
          }
        });
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
}
