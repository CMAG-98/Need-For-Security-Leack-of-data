import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  user: User;
  theFormGroup: FormGroup;
  trySend: boolean;
  showPassword: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
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

    if (this.activatedRoute.snapshot.params.id) {
      const userId = +this.activatedRoute.snapshot.params.id;
      this.user.id = userId;
      this.getUser(userId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getUser(id: number) {
    this.userService.view(id).subscribe({
      next: (response) => {
        this.user = response;
        this.theFormGroup.patchValue({
          id: this.user.id,
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        });
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
    this.router.navigate(['/users/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.userService.create(this.theFormGroup.value).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        Swal.fire('Creado!', 'Usuario creado correctamente.', 'success');
        this.router.navigate(['/users/list']);
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.userService.update(this.theFormGroup.value).subscribe({
      next: (user) => {
        console.log('User updated successfully:', user);
        Swal.fire('Actualizado!', 'Usuario actualizado correctamente.', 'success');
        this.router.navigate(['/users/list']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }
}
