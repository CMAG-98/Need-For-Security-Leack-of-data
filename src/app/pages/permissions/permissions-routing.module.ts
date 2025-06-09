import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { PermissionsbyroleComponent } from '../role-permissions/permissionsbyrole/permissionsbyrole.component';
import { RolesbypermissionComponent } from '../role-permissions/rolesbypermission/rolesbypermission.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'create', component: ManageComponent },
  { path: 'view/:id', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent },
  { path: 'permissions-by-role/:id', component: PermissionsbyroleComponent },
  { path: 'roles-by-permission/:id', component: RolesbypermissionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }