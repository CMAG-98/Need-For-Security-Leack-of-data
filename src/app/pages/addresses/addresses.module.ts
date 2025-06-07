import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressesRoutingModule } from './addresses-routing.module';
import { AddressManageComponent } from './manage/manage.component';
import { AddressListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AddressOfUserComponent } from './address-of-user/address-of-user.component';


@NgModule({
  declarations: [
    AddressManageComponent,
    AddressListComponent,
    AddressOfUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddressesRoutingModule,
    LeafletModule
  ]
})
export class AddressesModule { }
