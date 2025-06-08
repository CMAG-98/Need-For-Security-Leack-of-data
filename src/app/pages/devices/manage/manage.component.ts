import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from 'src/app/models/device.model';
import { User } from 'src/app/models/user.model';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  user: User = new User();
  device: Device = new Device();

  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private deviceService: DeviceService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.trySend = false;
    this.user = { email: '', password: '' };
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    this.updateFormState();

    if (this.activatedRoute.snapshot.params.user) {
      const userId = +this.activatedRoute.snapshot.params.user;
      this.user.id = userId;
      this.getUser(userId);
    }

    if (this.activatedRoute.snapshot.params.id) {
      const deviceId = +this.activatedRoute.snapshot.params.id;
      this.device.id = deviceId;
      this.getDevice(deviceId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      ip: ['', [Validators.required]],
      operating_system: ['', [Validators.required]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getDevice(id: number) {
    this.deviceService.getById(id).subscribe({
      next: (response) => {
        this.device = response;
        this.theFormGroup.patchValue({
          id: this.device.id,
          name: this.device.name,
          ip: this.device.ip,
          operating_system: this.device.operating_system
        });
        this.updateFormState();
        console.log('User fetched successfully:', this.user);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  getUser(id: number) {
    this.userService.view(id).subscribe({
      next: (response) => {
        this.user = response;
        this.updateFormState();
        console.log('User fetched successfully:', this.user);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  updateFormState() {
    if (this.mode === 1) {
      this.theFormGroup.disable();
    } else {
      this.theFormGroup.enable();
    }
  }

  back() {
    this.router.navigate([`/devices/${this.user.id}/list`]);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.deviceService.create(this.theFormGroup.value, this.user.id.toString()).subscribe({
      next: (device) => {
        console.log('device created successfully:', device);
        Swal.fire('Creado!', 'Dispositivo creado correctamente.', 'success');
        this.back()
      },
      error: (error) => {
        console.error('Error creating device:', error);
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.deviceService.update(this.theFormGroup.value).subscribe({
      next: (device) => {
        console.log('device updated successfully:', device);
        Swal.fire('Actualizado!', 'Dispositivo actualizado correctamente.', 'success');
        this.back()
      },
      error: (error) => {
        console.error('Error updating device:', error);
      }
    });
  }
}
