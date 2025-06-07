import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/models/address.mode';
import { User } from 'src/app/models/user.model';
import { AddressService } from 'src/app/services/address.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

import * as L from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';

// Configuración global de iconos Leaflet
(function configureLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/assets/marker-icon-2x.png',
    iconUrl: '/assets/marker-icon.png',
    shadowUrl: '/assets/marker-shadow.png'
  });
})();

@Component({
  selector: 'app-address-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class AddressManageComponent implements OnInit {
  address: Address | null = null;
  users: User[] = [];

  theFormGroup: FormGroup;
  mode: number = 0; // 1=ver, 2=crear, 3=editar
  trySend: boolean = false;

  selectedUserName: string = '';

  layers: L.Layer[] = [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    })
  ];

  options = {
    zoom: 13,
    center: L.latLng(5.0703, -75.5138), // Manizales
  };


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private addressService: AddressService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.theFormGroup = this.fb.group({
      id: [0],
      street: ['', Validators.required],
      number: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      user_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    forkJoin({
      users: this.userService.list()
    }).subscribe({
      next: ({ users }) => {
        this.users = users;

        const currentUrl = this.activatedRoute.snapshot.url.join('/');
        if (currentUrl.includes('view')) {
          this.mode = 1;
        } else if (currentUrl.includes('create')) {
          this.mode = 2;
        } else if (currentUrl.includes('update')) {
          this.mode = 3;
        }

        if (this.mode === 2) {
          this.options = {
            ...this.options,
            center: L.latLng(5.0703, -75.5138),
            zoom: 13
          };
        }

        this.updateFormState();

        const addressId = this.activatedRoute.snapshot.params.id;
        if (addressId) {
          this.getAddress(addressId);
        }
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      }
    });
  }


  getAddress(id: number) {
    this.addressService.view(id).subscribe({
      next: (response: Address) => {
        this.address = response;

        this.theFormGroup.patchValue({
          id: response.id,
          street: response.street,
          number: response.number,
          latitude: response.latitude,
          longitude: response.longitude,
          user_id: response.user_id
        });

        this.updateSelectedUserName();
        this.updateFormState();

        this.layers = [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }),
          L.marker([response.latitude, response.longitude])
        ];

        this.options = {
          ...this.options,
          center: L.latLng(response.latitude, response.longitude),
          zoom: 15
        };
      },
      error: (error) => {
        console.error('Error al obtener la dirección:', error);
      }
    });
  }

  updateSelectedUserName() {
    if (!this.address) {
      this.selectedUserName = '';
      return;
    }

    const user = this.users.find(u => u.id === this.address!.user_id);
    this.selectedUserName = user ? user.name : 'Desconocido';
  }

  updateFormState() {
    if (this.mode === 1) {
      this.theFormGroup.disable();
    } else {
      this.theFormGroup.enable();
    }
  }

  back() {
    this.router.navigate(['/address/list']);
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    const formValue = this.theFormGroup.value;
    const userId = formValue.user_id;

    this.addressService.list().subscribe({
      next: (addresses: Address[]) => {
        const userAlreadyHasAddress = addresses.some(addr => addr.user_id === userId);

        if (userAlreadyHasAddress) {
          Swal.fire('Error', 'Este usuario ya tiene una dirección registrada.', 'error');
          return;
        }

        this.addressService.create(formValue, userId).subscribe({
          next: () => {
            Swal.fire('Creado', 'Dirección creada correctamente.', 'success');
            this.router.navigate(['/address/list']);
          },
          error: (err) => console.error(err)
        });
      },
      error: (err) => {
        console.error('Error al verificar direcciones:', err);
        Swal.fire('Error', 'No se pudo verificar las direcciones existentes.', 'error');
      }
    });
  }

  update() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.addressService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Dirección actualizada correctamente.', 'success');
        this.router.navigate(['/address/list']);
      },
      error: (err) => console.error(err)
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  onMapClick(event: LeafletMouseEvent) {
    if (this.mode === 1) return;

    const { lat, lng } = event.latlng;

    this.theFormGroup.patchValue({
      latitude: lat,
      longitude: lng
    });

    this.layers = [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }),
      L.marker([lat, lng])
    ];
  }
}
