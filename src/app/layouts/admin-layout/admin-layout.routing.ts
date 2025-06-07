import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    {
        path: 'users',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/users/users.module').then(m => m.UsersModule)
            }
        ]
    },
    {
        path: 'devices',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/devices/devices.module').then(m => m.DevicesModule)
            }
        ]
    },
    {
        path: 'signatures',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/signatures/signatures.module').then(m => m.SignaturesModule)
            }
        ]
    },
    {
        path: 'questions',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/questions/questions.module').then(m => m.QuestionsModule)
            }
        ]
    },
    {
        path: 'roles',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/roles/roles.module').then(m => m.RolesModule)
            }
        ]
    },
    {
        path: 'user-roles',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/user-roles/user-roles.module').then(m => m.UserRolesModule)
            }
        ]
    },
    {
        path: 'passwords',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/passwords/passwords.module').then(m => m.PasswordsModule)
            }
        ]
    },
        {
        path: 'address',
        children: [
            {
                path: '',
                loadChildren: () => import('src/app/pages/addresses/addresses.module').then(m => m.AddressesModule)
            }
        ]
    },
];
