import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { AuthenticatedGuard } from 'src/app/guards/authenticated.guard';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component:DashboardComponent, canActivate:[AuthenticatedGuard] }
];
