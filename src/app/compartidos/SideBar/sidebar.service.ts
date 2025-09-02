import { Injectable } from '@angular/core';
import { routes } from '../../app.routes';
import { MenuItem } from './menu-item';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // menu: any[]=[{
  //   titulo:`Ofertas`,
  //   icono:``
    
  // }]

  // sidebar.service.ts
  menu: MenuItem[] = [
    { titulo: "Buscar", ruta: "", icono: "search",
      children: [
        { titulo: "Buscar Empresa", ruta: "", icono: "search", codigoPermiso: "BUSCAR_EMPRESAS"},
        { titulo: "Buscar Ofertas", ruta: "", icono: "search", codigoPermiso: "BUSCAR_OFERTAS"},
        { titulo: "Buscar Candidatos", ruta: "", icono: "search", codigoPermiso: "BUSCAR_CANDIDATOS"}
      ]
     },
    { titulo: "Mi Perfil", ruta: "", icono: "person", codigoPermiso: "GESTIONAR_MI_PERFIL" },
    { titulo: "Notificaciones", ruta: "", icono: "notifications", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Ofertas", ruta: "", icono: "card_giftcard",
      children: [
        { titulo: "Ofertas", ruta: "", icono: "", codigoPermiso: "GESTION_OFERTAS"},
        { titulo: "Etapas", ruta: "", icono: "", codigoPermiso: "GESTION_ETAPA_PERSONALIZADA"}
      ]
     },
    { titulo: "Empleados", ruta: "", icono: "badge", codigoPermiso: "GESTIONAR_EMPLEADOS" },
    { titulo: "Estadísticas", ruta: "", icono: "query_stats", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Panel de control", ruta: "", icono: "settings", 
      children: [
        { titulo: "Roles", ruta: "/gestion-de-roles", icono: "", codigoPermiso: "GESTIONAR_ROLES"},
        { titulo: "Backup", ruta: "", icono: "", codigoPermiso: "BACKUP"},
        { titulo: "Parámetros", ruta: "", icono: "", codigoPermiso: ""}
      ]
     },
    { titulo: "Habilitaciones", ruta: "", icono: "domain", codigoPermiso: "HABILITACION_EMPRESA" },
    { titulo: "Usuarios", ruta: "/usuarios", icono: "groups_2", codigoPermiso: "GESTIONAR_USUARIOS" },
    { titulo: "Calendario", ruta: "", icono: "", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Postulaciones", ruta: "", icono: "", codigoPermiso: "POSTULAR_OFERTA" }
  ];


  constructor() { }

  
}
