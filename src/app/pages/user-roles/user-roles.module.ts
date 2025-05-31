import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ManageComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    UserRolesRoutingModule
  ]
})
export class UserRolesModule { }
