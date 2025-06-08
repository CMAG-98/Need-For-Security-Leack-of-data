import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Signature } from 'src/app/models/signature.model';
import { User } from 'src/app/models/user.model';
import { SignatureService } from 'src/app/services/signature.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number = 1;
  user: User;
  signature: Signature;

  trySend: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private signatureService: SignatureService
  ) {
    this.trySend = false;
    this.user = { email: '', password: '' };
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (this.activatedRoute.snapshot.params.id) {
      const userId = +this.activatedRoute.snapshot.params.id;
      this.user.id = userId;
      this.getUser(userId);
      this.getSign(userId);
    }
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

  getSign(id: number) {
    this.signatureService.getByUserId(id).subscribe({
      next: (response) => {
        this.signature = response;

        this.signature.photo = environment.url_ms_security + "/" + this.signature.photo
        console.log('signature fetched successfully:', this.signature);
        this.mode = 3;
      },
      error: (error) => {
        console.log('Error fetching signature:', error);
        if (error.status == 404) {
          this.mode = 2;
        }
      }
    });
  }

  back() {
    this.router.navigate(['/users/list']);
  }

  submit(event) {
    if (!this.user.id)
    {
      return;
    }

    let file = event.target.files[0];

    this.trySend = true;

    if (this.mode == 2) {
      this.signatureService.create(file, this.user.id.toString()).subscribe({
        next: (signature) => {
          console.log('signature created successfully:', signature);
          Swal.fire('Creado!', 'Firma creada correctamente.', 'success');
          this.router.navigate(['/users/list']);
        },
        error: (error) => {
          console.error('Error creating signature:', error);
        }
      });
    }
    else if (this.mode == 3) {
      this.signatureService.update(file, this.user.id.toString()).subscribe({
        next: (signature) => {
          console.log('signature updated successfully:', signature);
          Swal.fire('Hecho!', 'Firma actualizada correctamente.', 'success');
          this.router.navigate(['/users/list']);
        },
        error: (error) => {
          console.error('Error creating signature:', error);
        }
      });
    }
  }

  delete() {
    this.signatureService.delete(this.signature.id).subscribe({
        next: (signature) => {
          console.log('signature deleted successfully:', signature);
          Swal.fire('Hecho!', 'Firma eliminada correctamente.', 'success');
          this.router.navigate(['/users/list']);
        },
        error: (error) => {
          console.error('Error creating signature:', error);
        }
      });
  }
}
