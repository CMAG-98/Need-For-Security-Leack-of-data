import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordService } from 'src/app/services/password.service';
import { Password } from 'src/app/models/password.mode';


@Component({
  selector: 'app-password-list-by-user',
  templateUrl: './password-list-by-user.component.html',
})
export class PasswordListByUserComponent implements OnInit {
  passwords: Password[] = [];
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private passwordService: PasswordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.passwordService.getByUserId(this.userId).subscribe({
      next: (data) => this.passwords = data,
      error: (err) => console.error('Error al obtener passwords', err)
    });
  }
  
  back() {
    this.router.navigate(['/users/list']);
  }
}
