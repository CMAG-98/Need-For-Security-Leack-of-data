import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { UserRoleManageComponent } from './manage/manage.component';
import { UserRoleListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserRoleManageComponent,
    UserRoleListComponent,
  ],
  imports: [
    CommonModule,
    UserRolesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserRolesModule { }
