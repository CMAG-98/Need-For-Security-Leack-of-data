import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Address } from 'src/app/models/address.mode';
import { User } from 'src/app/models/user.model';
import { AddressService } from 'src/app/services/address.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AddressListComponent implements OnInit {
  addresses: Address[] = [];
  users: User[] = []

  constructor(
    private addressService: AddressService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    forkJoin({
      addresses: this.addressService.list(),
      users: this.userService.list()
    }).subscribe({
      next: ({ addresses, users }) => {
        this.addresses = addresses;
        this.users = users;
      },
      error: (err) => {
        console.error('Error cargando direcciones o usuarios', err);
      }
    });
  }

  list(): void {
    this.addressService.list().subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: (err) => {
        console.error('Error al cargar direcciones', err);
      }
    });
  }

  getUserName(id: number): string {
    const user = this.users.find(u => u.id === id);
    return user ? user.name : 'Desconocido';
  }

  create(): void {
    this.router.navigate(['/address/create']);
  }

  view(id: number): void {
    this.router.navigate(['/address/view/' + id]);
  }

  edit(id: number): void {
    this.router.navigate(['/address/update/' + id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar dirección',
      text: '¿Está seguro de que desea eliminar esta dirección?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.addressService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La dirección fue eliminada.', 'success');
            this.list();
          },
          error: (err) => {
            console.error('Error al eliminar dirección', err);
            Swal.fire('Error', 'No se pudo eliminar la dirección.', 'error');
          }
        });
      }
    });
  }
}
