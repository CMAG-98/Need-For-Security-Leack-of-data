import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { ManageComponent } from './manage/manage.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManageComponent,
  ],
  imports: [
    CommonModule,
    ProfilesRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class ProfilesModule { }
