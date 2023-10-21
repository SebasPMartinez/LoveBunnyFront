import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'app/Modelos/Usuario/usuario';
import { UsuarioService } from 'app/Servicios/Usuario/usuario.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Chat', icon: 'chat', class: '' },
  { path: '/user-profile', title: 'Perfil del Usuario', icon: 'manage_accounts', class: '' },
  { path: '/cerrar-sesion', title: 'Cerrar sesion', icon: 'logout', class: '' },
  // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  infoPerfilSesion: UsuarioModel = new UsuarioModel();

  constructor(
    private router: Router,
    private servicioPerfiles: UsuarioService,


  ) {
    this.infoPerfilSesion = JSON.parse(sessionStorage.getItem('datosPerfil'));
  }

  ngOnInit() {


    if (!JSON.parse(sessionStorage.getItem('datosPerfil')!)) {
      this.router.navigateByUrl('/');
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };



  cerrarSesion() {


    const servicioObtener = this.servicioPerfiles.cerrarSesion(this.infoPerfilSesion._id).subscribe(
      // const servicioObtener = this.servicioPerfiles.obtenerPorPerfil(this.formularioLogin.controls['usuario'].value).subscribe(
      async (responseObtener) => {
        console.log(responseObtener);

      }
    );

    sessionStorage.removeItem('datosPerfil');
    window.location.reload();
    this.router.navigateByUrl('/');
  }
}
