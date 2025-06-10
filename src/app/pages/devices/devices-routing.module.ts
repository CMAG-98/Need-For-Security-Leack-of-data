import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { AuthenticatedGuard } from 'src/app/guards/authenticated.guard';

const routes: Routes = [
    { path: ':user/list', component: ListComponent, canActivate: [AuthenticatedGuard] },
    { path: ':user/create', component: ManageComponent, canActivate: [AuthenticatedGuard] },
    { path: ':user/view/:id', component: ManageComponent, canActivate: [AuthenticatedGuard] },
    { path: ':user/update/:id', component: ManageComponent, canActivate: [AuthenticatedGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
