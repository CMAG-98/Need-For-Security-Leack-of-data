import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from 'src/app/models/device.model';
import { User } from 'src/app/models/user.model';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  user: User = {
    id: 0
  };
  devices: Device[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private deviceService: DeviceService
  ) { }

  ngOnInit(): void {
    const userId = +this.activatedRoute.snapshot.params.user;
    this.user.id = userId;
    this.list(userId);
    this.getUser(userId);
  }

  getUser(id: number) {
    this.userService.view(id).subscribe({
      next: (response) => {
        this.user = response;
        console.log('User fetched successfully:', this.user);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  list(id: number): void {
    this.deviceService.getByUserId(id).subscribe({
      next: (devices) => {
        this.devices = devices;
      },
      error: (err) => {
        console.error('Error al cargar dispositivos', err);
      }
    });
  }

  create(): void {
    this.router.navigate([`/devices/${this.user.id}/create`]);
  }

  view(id: number): void {
    this.router.navigate([`/devices/${this.user.id}/view/` + id]);
  }

  edit(id: number): void {
    this.router.navigate([`/devices/${this.user.id}/update/` + id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar dispositivo',
      text: '¿Está seguro de que desea eliminar este dispositivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deviceService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El dispositivo ha sido eliminado.', 'success');
            this.list(this.user.id);
          },
          error: (err) => {
            console.error('Error al eliminar dispositivo', err);
            Swal.fire('Error', 'No se pudo eliminar el dispositivo.', 'error');
          }
        });
      }
    });
  }
}
