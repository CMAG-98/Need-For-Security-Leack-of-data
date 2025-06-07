import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './list/list.component';
import { UserManageComponent } from './manage/manage.component';
import { RolesByUserComponent } from '../user-roles/rolesbyuser/rolesbyuser.component';

const routes: Routes = [
  { path: 'list', component: UserListComponent },
  { path: 'create', component: UserManageComponent },
  { path: 'view/:id', component: UserManageComponent },
  { path: 'update/:id', component: UserManageComponent },
  { path: 'user-roles/user/:user_id', component: RolesByUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
