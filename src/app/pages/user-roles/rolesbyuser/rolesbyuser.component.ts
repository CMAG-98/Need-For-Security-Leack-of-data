import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRoleService } from 'src/app/services/user-role.service';
import { UserRole } from 'src/app/models/user-role.mode';

@Component({
  selector: 'app-rolesbyuser',
  templateUrl: './rolesbyuser.component.html',
  styleUrls: ['./rolesbyuser.component.scss']
})
export class RolesByUserComponent implements OnInit {
  userId!: number;
  userRoles: UserRole[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userRoleService: UserRoleService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('user_id'));

    console.log('Cargando roles para usuario:', this.userId);

    this.userRoleService.getRoleByUser(this.userId).subscribe({
      next: (res) => {
        console.log('Respuesta raw:', res);
        console.log('Es un array:', Array.isArray(res));
        console.log('Cantidad de roles:', res.length);

        this.userRoles = res;
        console.log('Roles procesados:', this.userRoles);
      },
      error: (err) => {
        console.error('Error al obtener roles del usuario:', err);
        this.userRoles = []; // para que no quede undefined
      },
      complete: () => {
        this.loading = false;
        console.log('Carga finalizada, loading:', this.loading);
      }
    });
  }

  back(): void {
    history.back();
  }
}
