import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './list/list.component';
import { RoleManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersbyrolComponent } from '../user-roles/usersbyrol/usersbyrol.component';


@NgModule({
  declarations: [
    RoleListComponent,
    RoleManageComponent,
    UsersbyrolComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RolesModule { }
