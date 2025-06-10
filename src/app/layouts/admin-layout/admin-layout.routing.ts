import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

import { AuthenticatedGuard } from 'src/app/guards/authenticated.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticatedGuard] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthenticatedGuard] },
    { path: 'tables', component: TablesComponent, canActivate: [AuthenticatedGuard] },
    { path: 'icons', component: IconsComponent, canActivate: [AuthenticatedGuard] },
    { path: 'maps', component: MapsComponent, canActivate: [AuthenticatedGuard] },
    {
        path: 'users',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/users/users.module').then(m => m.UsersModule)
            }
        ]
    },
    {
        path: 'devices',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/devices/devices.module').then(m => m.DevicesModule)
            }
        ]
    },
    {
        path: 'signatures',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/signatures/signatures.module').then(m => m.SignaturesModule)
            }
        ]
    },
    {
        path: 'questions',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/questions/questions.module').then(m => m.QuestionsModule)
            }
        ]
    },
    {
        path: 'roles',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/roles/roles.module').then(m => m.RolesModule)
            }
        ]
    },
    {
        path: 'user-roles',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/user-roles/user-roles.module').then(m => m.UserRolesModule)
            }
        ]
    },
    {
        path: 'passwords',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/passwords/passwords.module').then(m => m.PasswordsModule)
            }
        ]
    },
    {
        path: 'address',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/addresses/addresses.module').then(m => m.AddressesModule)
            }
        ]
    },
    {
        path: 'profiles',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/profiles/profiles.module').then(m => m.ProfilesModule)
            }
        ]
    },
    {
        path: 'sessions',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/sessions/sessions.module').then(m => m.SessionsModule)
            }
        ]
    },
    {
        path: 'permissions',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/permissions/permissions.module').then(m => m.PermissionsModule)
            }
        ]
    },
    {
        path: 'role-permissions',
        canActivate: [AuthenticatedGuard],
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/role-permissions/role-permissions.module').then(m => m.RolePermissionsModule)
            }
        ]
    },
];
