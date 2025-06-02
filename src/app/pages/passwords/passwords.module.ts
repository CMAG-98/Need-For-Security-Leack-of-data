import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordsRoutingModule } from './passwords-routing.module';
import { PasswordManageComponent } from './manage/manage.component';
import { PasswordListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PasswordManageComponent,
    PasswordListComponent
  ],
  imports: [
    CommonModule,
    PasswordsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PasswordsModule { }
