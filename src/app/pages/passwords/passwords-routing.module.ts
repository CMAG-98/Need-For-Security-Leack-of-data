import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordListComponent } from './list/list.component';
import { PasswordManageComponent } from './manage/manage.component';
import { PasswordListByUserComponent } from './password-list-by-user/password-list-by-user.component';

const routes: Routes = [
  { path: 'list', component: PasswordListComponent },
  { path: 'create', component: PasswordManageComponent },
  { path: 'view/:id', component: PasswordManageComponent },
  { path: 'update/:id', component: PasswordManageComponent },
  { path: 'user/:id', component: PasswordListByUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordsRoutingModule { }
