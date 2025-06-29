import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  type: number;//0->No está logueado, se pone si no está logueado
  //1->Si está logueado, si se pone si está logueado
  //2->No importa
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', type: 2 },
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '', type: 1 },
  // { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '', type: 1 },
  // { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '', type: 1 },
  { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '', type: 0 },
  { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '', type: 0 },
  { path: '/users/list', title: 'Usuarios', icon: 'ni-user-run text-primary', class: '', type: 1 },
  // { path: '/devices/list', title: 'Dispositivos', icon: 'ni-camera-compact text-primary', class: '', type: 1 },
  { path: '/questions/list', title: 'Preguntas', icon: 'ni-send text-primary', class: '', type: 1 },
  // { path: '/signatures/list', title: 'Firmas', icon: 'ni-badge text-primary', class: '', type: 1 },
  { path: '/roles/list', title: 'Roles', icon: 'ni-controller text-red', class: '', type: 1 },
  { path: '/user-roles/list', title: 'Roles de usuarios', icon: 'ni-settings text-purple', class: '', type: 1 },
  { path: '/passwords/list', title: 'Contraseñas', icon: 'ni-key-25 text-green', class: '', type: 1 },
  { path: '/address/list', title: 'Direcciones', icon: 'ni-square-pin text-orange', class: '', type: 1 },
  { path: '/permissions/list', title: 'Permisos', icon: 'ni-lock-circle-open text-danger', class: '', type: 1 }

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router, private securityService: SecurityService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
