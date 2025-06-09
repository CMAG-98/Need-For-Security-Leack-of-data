import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionsbyroleComponent } from '../role-permissions/permissionsbyrole/permissionsbyrole.component';
import { RolesbypermissionComponent } from '../role-permissions/rolesbypermission/rolesbypermission.component';

@NgModule({
  declarations: [
    ListComponent,
    ManageComponent,
    PermissionsbyroleComponent,
    RolesbypermissionComponent
  ],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PermissionsModule { }