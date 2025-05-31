import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './list/list.component';
import { UserManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: 'list', component: UserListComponent },
  { path: 'create', component: UserManageComponent },
  { path: 'view/:id', component: UserManageComponent },
  { path: 'update/:id', component: UserManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
