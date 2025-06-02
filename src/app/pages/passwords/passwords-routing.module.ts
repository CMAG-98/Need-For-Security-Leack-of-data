import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordListComponent } from './list/list.component';
import { PasswordManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: 'list', component: PasswordListComponent },
  { path: 'create', component: PasswordManageComponent },
  { path: 'view/:id', component: PasswordManageComponent },
  { path: 'update/:id', component: PasswordManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordsRoutingModule { }
