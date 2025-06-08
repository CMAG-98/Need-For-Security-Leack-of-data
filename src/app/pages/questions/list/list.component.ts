import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityQuestion } from 'src/app/models/securityQuestion.model';
import { User } from 'src/app/models/user.model';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  questions: SecurityQuestion[] = [];
  canCreate: boolean = false;

  question: SecurityQuestion = new SecurityQuestion();

  @ViewChild('qInput') qInput!: ElementRef;
  @ViewChild('qInput2') qInput2!: ElementRef;

  constructor(
    private userService: UserService,
    private questionService: SecurityQuestionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
    this.list();
  }

  list(): void {
    this.questionService.list().subscribe({
      next: (data) => {
        this.questions = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      }
    });
  }

  changeName(event: any): void {
    this.question.name = event.target.value ?? "";
    this.updateDisabled()
  }

  changeDescription(event: any): void {
    this.question.description = event.target.value ?? "";
    this.updateDisabled()
  }

  updateDisabled()
  {
    this.canCreate = (this.question.name ?? "").length > 0 && (this.question.description ?? "").length > 0
  }

  clear(): void {
    this.question = new SecurityQuestion();
    this.qInput.nativeElement.value = ""
    this.qInput2.nativeElement.value = ""
    this.updateDisabled()
  }

  create(): void {
    if (!this.canCreate) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.questionService.create({ name: this.qInput.nativeElement.value, description: this.qInput2.nativeElement.value }).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        Swal.fire('Creado!', 'Pregunta creada correctamente.', 'success');
        this.list()
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });

    this.clear()
  }

  view(id: number): void {
    this.router.navigate(['/questions/view/' + id]);
  }

  edit(id: number): void {
    this.router.navigate(['/questions/update/' + id]);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar pregunta',
      text: '¿Está seguro de que desea eliminar esta pregunta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.questionService.delete(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success');
            this.list();
          },
          error: (err) => {
            console.error('Error al eliminar registro', err);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }
}
