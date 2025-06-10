import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsbyroleComponent } from './permissionsbyrole/permissionsbyrole.component';

const routes: Routes = [
  { path: 'permissions-by-role/:id', component: PermissionsbyroleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolePermissionsRoutingModule { }