import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/role.mode';
import { RoleService } from 'src/app/services/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})

export class RoleManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  role: Role;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private roleService: RoleService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.trySend = false;
    this.role = { id: 0, name: '', description: '' };
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

    if (this.activatedRoute.snapshot.params.id) {
      const roleId = +this.activatedRoute.snapshot.params.id;
      this.role.id = roleId;
      this.getRole(roleId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getRole(id: number) {
    this.roleService.view(id).subscribe({
      next: (response) => {
        this.role = response;
        this.theFormGroup.patchValue({
          id: this.role.id,
          name: this.role.name,
          description: this.role.description
        });
        this.updateFormState();
        console.log('Role fetched successfully:', this.role);
      },
      error: (error) => {
        console.error('Error fetching role:', error);
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
    this.router.navigate(['/roles/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.roleService.create(this.theFormGroup.value).subscribe({
      next: (role) => {
        console.log('Role created successfully:', role);
        Swal.fire('Creado!', 'Rol creado correctamente.', 'success');
        this.router.navigate(['/roles/list']);
      },
      error: (error) => {
        console.error('Error creating role:', error);
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.roleService.update(this.theFormGroup.value).subscribe({
      next: (role) => {
        console.log('Role updated successfully:', role);
        Swal.fire('Actualizado!', 'Rol actualizado correctamente.', 'success');
        this.router.navigate(['/roles/list']);
      },
      error: (error) => {
        console.error('Error updating role:', error);
      }
    });
  }
}
