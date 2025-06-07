import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './list/list.component';
import { RoleManageComponent } from './manage/manage.component';
import { UsersbyrolComponent } from '../user-roles/usersbyrol/usersbyrol.component';

const routes: Routes = [
    { path: 'list', component: RoleListComponent },
    { path: 'create', component: RoleManageComponent },
    { path: 'view/:id', component: RoleManageComponent },
    { path: 'update/:id', component: RoleManageComponent },
    { path: 'user-roles/:id', component: UsersbyrolComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
