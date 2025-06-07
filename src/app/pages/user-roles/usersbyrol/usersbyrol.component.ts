import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoleService } from 'src/app/services/user-role.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-usersbyrol',
  templateUrl: './usersbyrol.component.html',
  styleUrls: ['./usersbyrol.component.scss']
})
export class UsersbyrolComponent implements OnInit {

  roleId!: number;
  users: User[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userRoleService: UserRoleService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roleId = +this.route.snapshot.paramMap.get('id')!;

    this.userRoleService.getUserByRol(this.roleId).subscribe({
      next: (userRoles: any[]) => {
        if (!userRoles.length) {
          this.users = [];
          this.loading = false;
          return;
        }

        // Obtener los IDs de usuario de la relación
        const userIds = userRoles.map(ur => ur.user_id);

        // Hacer peticiones a userService.view(id) por cada usuario
        const userObservables = userIds.map(id => this.userService.view(id));

        forkJoin(userObservables).subscribe({
          next: (users: User[]) => {
            this.users = users;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error cargando detalles de usuarios:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar relaciones user-role:', err);
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/roles/list']);
  }
}
