import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/list.component';
import { UserManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesByUserComponent } from '../user-roles/rolesbyuser/rolesbyuser.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserManageComponent,
    RolesByUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
