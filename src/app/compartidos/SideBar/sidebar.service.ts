import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // menu: any[]=[{
  //   titulo:`Ofertas`,
  //   icono:``
    
  // }]

  // sidebar.service.ts
  menu = [
    { titulo: "Buscar", ruta: "/buscar", icono: "search", codigoPermiso: "VER_HABILITACIONES" },
    { titulo: "Mi Perfil", ruta: "/perfil", icono: "person", codigoPermiso: "VER_PERFIL" },
    { titulo: "Notificaciones", ruta: "/notificaciones", icono: "notifications", codigoPermiso: "VER_NOTIFICACIONES" },
    { titulo: "Mensajes", ruta: "/mensajes", icono: "chat_bubble", codigoPermiso: "VER_MENSAJES" },
    { titulo: "Ofertas", ruta: "/ofertas", icono: "card_giftcard", codigoPermiso: "BUSCAR_OFERTAS" },
    { titulo: "Empleados", ruta: "/empleados", icono: "badge", codigoPermiso: "VER_EMPLEADOS" },
    { titulo: "Estadísticas", ruta: "/estadisticas", icono: "query_stats", codigoPermiso: "VER_ESTADISTICAS" }
  ];


  constructor() { }

  
}
