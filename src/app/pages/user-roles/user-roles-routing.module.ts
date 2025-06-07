import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoleListComponent } from './list/list.component';
import { UserRoleManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: 'list', component: UserRoleListComponent },
  { path: 'create', component: UserRoleManageComponent },
  { path: 'view/:id', component: UserRoleManageComponent },
  { path: 'update/:id', component: UserRoleManageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRolesRoutingModule { }
