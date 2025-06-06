import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressListComponent } from './list/list.component';
import { AddressManageComponent } from './manage/manage.component';
import { AddressOfUserComponent } from './address-of-user/address-of-user.component';


const routes: Routes = [
  { path: 'list', component: AddressListComponent },
  { path: 'create', component: AddressManageComponent },
  { path: 'view/:id', component: AddressManageComponent },
  { path: 'update/:id', component: AddressManageComponent },
  { path: 'user/:id', component: AddressOfUserComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressesRoutingModule { }
