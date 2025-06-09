import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePermissionsRoutingModule } from './role-permissions-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionsbyroleComponent } from './permissionsbyrole/permissionsbyrole.component';
import { RolesbypermissionComponent } from './rolesbypermission/rolesbypermission.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent,
    PermissionsbyroleComponent,
    RolesbypermissionComponent
  ],
  imports: [
    CommonModule,
    RolePermissionsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class RolePermissionsModule { }
