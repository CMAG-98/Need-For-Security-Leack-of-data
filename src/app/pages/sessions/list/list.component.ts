import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { Session } from 'src/app/models/session';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  sessions: Session[] = [];
  userId: number | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Suscribimos a los parámetros de la ruta
    this.activatedRoute.params.subscribe(params => {
      if (params['userId']) {
        // Si se pasa el parámetro "userId", se convierte a número y se carga la lista filtrada
        this.userId = +params['userId'];
        this.sessionService.getByUserId(this.userId).subscribe({
          next: (sessions) => { this.sessions = sessions; },
          error: (err) => { console.error('Error al cargar sesiones del usuario', err); }
        });
      } else {
        // Si no existe el parámetro, cargamos todas las sesiones
        this.listAllSessions();
      }
    });
  }

  listAllSessions(): void {
    this.sessionService.list().subscribe({
      next: (sessions) => { this.sessions = sessions; },
      error: (err) => { console.error('Error al cargar sesiones', err); }
    });
  }

  create(): void {
    // Si tenemos userId, navegamos a la ruta de creación con ese parámetro
    if (this.userId) {
      this.router.navigate(['/sessions/user', this.userId, 'create']);
    } else {
      this.router.navigate(['/sessions/create']);
    }
  }

  view(id: string): void {
    this.router.navigate(['/sessions/view', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/sessions/update', id]);
  }

  delete(id: string): void {
    Swal.fire({
      title: 'Eliminar',
      text: "¿Está seguro que desea eliminar la sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sessionService.delete(id).subscribe(() => {
          Swal.fire('Eliminado!', 'Registro eliminado correctamente.', 'success');
          // Actualizamos la lista luego de la eliminación
          if(this.userId) {
            this.sessionService.getByUserId(this.userId).subscribe({
              next: (sessions) => { this.sessions = sessions; },
              error: (err) => { console.error('Error al cargar sesiones del usuario', err); }
            });
          } else {
            this.listAllSessions();
          }
        });
      }
    });
  }
  
  back(): void {
    // Se puede definir la navegación de regreso (por ejemplo, a la página principal de sesiones)
    this.router.navigate(['/sessions/list']);
  }
}