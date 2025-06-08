import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
    { path: ':user/list', component: ListComponent },
    { path: ':user/create', component: ManageComponent },
    { path: ':user/view/:id', component: ManageComponent },
    { path: ':user/update/:id', component: ManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
