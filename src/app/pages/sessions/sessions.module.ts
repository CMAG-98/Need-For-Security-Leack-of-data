import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';
import { SessionsRoutingModule } from './sessions-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    ManageComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    SessionsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class SessionsModule { }
