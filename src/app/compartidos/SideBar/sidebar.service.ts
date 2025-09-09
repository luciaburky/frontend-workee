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
        { titulo: "Buscar Empresa", ruta: "/buscar-empresas", icono: "search", codigoPermiso: "BUSCAR_EMPRESAS"},
        { titulo: "Buscar Ofertas", ruta: "/buscar-candidatos", icono: "search", codigoPermiso: "BUSCAR_OFERTAS"},
        { titulo: "Buscar Candidatos", ruta: "/buscar-candidatos", icono: "search", codigoPermiso: "BUSCAR_CANDIDATOS"}
      ]
     },
    { titulo: "Mi Perfil", ruta: "/mi-perfil", icono: "person", codigoPermiso: "GESTIONAR_MI_PERFIL" },
    { titulo: "Notificaciones", ruta: "/notificaciones", icono: "notifications", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Ofertas", icono: "card_giftcard",
      children: [
        { titulo: "Ofertas", ruta: "/ofertas", icono: "", codigoPermiso: "GESTION_OFERTAS"},
        { titulo: "Etapas", ruta: "/ofertas/etapas", icono: "", codigoPermiso: "GESTION_ETAPA_PERSONALIZADA"}
      ]
     },
    { titulo: "Empleados", ruta: "/empleados", icono: "badge", codigoPermiso: "GESTIONAR_EMPLEADOS" },
    { titulo: "Estadísticas", ruta: "/estadisticas", icono: "query_stats", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Panel de control", ruta: "", icono: "settings", 
      children: [
        { titulo: "Roles", ruta: "/gestion-de-roles", icono: "", codigoPermiso: "GESTIONAR_ROLES"},
        { titulo: "Backup", ruta: "/backup", icono: "", codigoPermiso: "BACKUP"}, //TODO: Falta
        { titulo: "Parámetros", ruta: "/parametros", icono: "", codigoPermiso: "PARAMETROS"}
      ]
     },
    { titulo: "Habilitaciones", ruta: "/habilitaciones", icono: "domain", codigoPermiso: "HABILITACION_EMPRESA" },
    { titulo: "Usuarios", ruta: "/usuarios", icono: "groups_2", codigoPermiso: "GESTIONAR_USUARIOS" },
    { titulo: "Calendario", ruta: "/calendario", icono: "", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Postulaciones", ruta: "/postulaciones", icono: "", codigoPermiso: "POSTULAR_OFERTA" } //TODO: Falta
  ];


  constructor() { }

  
}
