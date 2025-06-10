import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePermissionsRoutingModule } from './role-permissions-routing.module';
import { PermissionsbyroleComponent } from './permissionsbyrole/permissionsbyrole.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PermissionsbyroleComponent,
  ],
  imports: [
    CommonModule,
    RolePermissionsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class RolePermissionsModule { }