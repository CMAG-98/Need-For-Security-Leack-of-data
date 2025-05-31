import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordsRoutingModule } from './passwords-routing.module';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ManageComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    PasswordsRoutingModule
  ]
})
export class PasswordsModule { }
