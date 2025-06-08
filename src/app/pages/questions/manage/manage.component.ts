import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer } from 'src/app/models/answer.model';
import { SecurityQuestion } from 'src/app/models/securityQuestion.model';
import { User } from 'src/app/models/user.model';
import { AnswerService } from 'src/app/services/answer.service';
import { SecurityQuestionService } from 'src/app/services/security-question.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @ViewChild('qInput') qInput!: ElementRef;
  canCreate: boolean = false;

  question: SecurityQuestion = new SecurityQuestion();
  answers: Answer[] = []
  answer: Answer = new Answer();

  userId: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private questionService: SecurityQuestionService,
    private answerService: AnswerService
  ) {
    this.userId = 1;
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (this.activatedRoute.snapshot.params.id) {
      const questionId = +this.activatedRoute.snapshot.params.id;
      this.question.id = questionId;
      this.getQuestion(questionId);
      this.getAnswers(questionId);
    }
  }

  getQuestion(id: number) {
    this.questionService.getById(id).subscribe({
      next: (response) => {
        this.question = response;
        console.log('question fetched successfully:', this.question);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  changeContent(event: any): void {
    this.answer.content = event.target.value ?? "";
    this.updateDisabled()
  }

  updateDisabled() {
    this.canCreate = (this.answer.content ?? "").length > 0
  }

  clear(): void {
    this.answer = new Answer();
    this.qInput.nativeElement.value = ""
    this.updateDisabled()
  }

  getAnswers(id: number) {
    /**
    {
        "content": "Fluffy",
        "created_at": "Sun, 08 Jun 2025 15:03:37 GMT",
        "id": 1,
        "security_question_id": 1,
        "updated_at": "Sun, 08 Jun 2025 15:03:37 GMT",
        "user_id": 1
    }
     */
    this.answerService.list().subscribe({
      next: (response) => {
        this.answers = response.filter(answer => answer.security_question_id == id);

        this.answers.forEach(answer => {
          if (answer.user_id == this.userId) {
            this.answer = window.structuredClone(answer);
            this.qInput.nativeElement.value = answer.content + "";
            this.updateDisabled()
          }
        })
        console.log('question fetched successfully:', this.answers);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/users/list']);
  }

  create() {
    if (!this.canCreate) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.answerService.create({ content: this.answer.content }, this.userId.toString(), this.question.id.toString()).subscribe({
      next: (user) => {
        console.log('answer created successfully:', user);
        this.getAnswers(this.question.id)
      },
      error: (error) => {
        console.error('Error creating answer:', error);
      }
    });
  }

  update() {
    if (!this.canCreate) {
      Swal.fire('Error!', 'Por favor, complete todos los campos requeridos.', 'error');
      return;
    }

    this.answerService.update({ content: this.answer.content, id: this.answer.id }).subscribe({
      next: (user) => {
        console.log('answer created successfully:', user);
        this.getAnswers(this.question.id)
      },
      error: (error) => {
        console.error('Error creating answer:', error);
      }
    });
  }

  
  delete() {
    if (!this.answer.id) {
      Swal.fire('Error!', 'No hay respuesta que eliminar.', 'error');
      return;
    }

    this.answerService.delete(this.answer.id).subscribe({
      next: (user) => {
        console.log('answer created successfully:', user);
        this.getAnswers(this.question.id)
        this.clear()
      },
      error: (error) => {
        console.error('Error creating answer:', error);
      }
    });
  }
}
