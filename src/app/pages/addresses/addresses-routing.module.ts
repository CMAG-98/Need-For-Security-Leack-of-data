import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressListComponent } from './list/list.component';
import { AddressManageComponent } from './manage/manage.component';

const routes: Routes = [
    { path: 'list', component: AddressListComponent },
    { path: 'create', component: AddressManageComponent },
    { path: 'view/:id', component: AddressManageComponent },
    { path: 'update/:id', component: AddressManageComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressesRoutingModule { }
