import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Password } from 'src/app/models/password.mode';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { PasswordService } from 'src/app/services/password.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-password-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class PasswordManageComponent implements OnInit {
  password: Password | null = null;
  users: User[] = [];

  theFormGroup: FormGroup;
  mode: number = 0; // 1=ver, 2=crear, 3=editar
  trySend: boolean = false;

  selectedUserName: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private passwordService: PasswordService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.theFormGroup = this.fb.group({
      id: [0],
      startAt: ['', Validators.required],
      content: [''],
      endAt: ['', Validators.required],
      id_user: ['', Validators.required]
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

        this.updateFormState();

        const passwordId = this.activatedRoute.snapshot.params.id;
        if (passwordId) {
          this.getPassword(passwordId);
        }
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
      }
    });
  }

  private formatDateToInputString(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  getPassword(id: number) {
    this.passwordService.view(id).subscribe({
      next: (response: Password) => {
        this.password = response;

        this.theFormGroup.patchValue({
          id: response.id,
          content: response.content,
          startAt: this.formatDateToInputString(response.startAt),
          endAt: response.endAt ? this.formatDateToInputString(response.endAt) : '',
          id_user: response.user_id
        });

        this.updateSelectedUserName();
        this.updateFormState();
      },
      error: (error) => {
        console.error('Error al obtener la contraseña:', error);
      }
    });
  }

  updateSelectedUserName() {
    if (!this.password) {
      this.selectedUserName = '';
      return;
    }

    const user = this.users.find(u => u.id === this.password!.user_id);
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
    this.router.navigate(['/passwords/list']);
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    const formValue = this.theFormGroup.value;
    const userId = formValue.id_user;
    console.log(userId);


    this.passwordService.create(formValue, userId).subscribe({
      next: () => {
        Swal.fire('Creado', 'Contraseña creada correctamente.', 'success');
        this.router.navigate(['/passwords/list']);
      },
      error: (err) => console.error(err)
    });
  }

  update() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.passwordService.update(this.theFormGroup.value).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Contraseña actualizada correctamente.', 'success');
        this.router.navigate(['/passwords/list']);
      },
      error: (err) => console.error(err)
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }
}
