import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  // Agregamos esta ruta para listar las sesiones de un usuario específico
  { path: 'user/:userId/list', component: ListComponent },
  { path: 'user/:userId/create', component: ManageComponent },
  { path: 'view/:id', component: ManageComponent },
  { path: 'update/:id', component: ManageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }