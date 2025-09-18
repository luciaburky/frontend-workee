import { Injectable } from '@angular/core';
import { routes } from '../../app.routes';
import { MenuItem } from './menu-item';
import { SesionService } from '../../interceptors/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor(private sesionService: SesionService){

  }

  getMenu(): MenuItem[]{
    const rol = this.sesionService.getRolActual();
    let perfilRuta = '/mi-perfil';

    if (rol) {
      switch (rol.codigoRol) {
        case 'CANDIDATO':
          perfilRuta = '/candidato/perfil';
          break;
        case 'ADMIN_EMPRESA':
          perfilRuta = '/empresas/perfil';
          break;
        case 'EMPLEADO_EMPRESA':
          perfilRuta = '/empleados/perfil';
          break;
      }
    }
    return [
    { titulo: "Buscar", ruta: "", icono: "search",
      children: [
        { titulo: "Buscar Empresa", ruta: "/buscar-empresas", icono: "search", codigoPermiso: "BUSCAR_EMPRESAS"},
        { titulo: "Buscar Ofertas", ruta: "/buscar-ofertas", icono: "search", codigoPermiso: "BUSCAR_OFERTAS"},
        { titulo: "Buscar Candidatos", ruta: "/buscar-candidatos", icono: "search", codigoPermiso: "BUSCAR_CANDIDATOS"}
      ]
     },
    { titulo: "Mi Perfil", ruta: perfilRuta, icono: "person", codigoPermiso: "GESTIONAR_MI_PERFIL" },
    //{ titulo: "Notificaciones", ruta: "/notificaciones", icono: "notifications", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Ofertas", icono: "card_giftcard",
      children: [
        { titulo: "Ofertas", ruta: "/visualizar-oferta", icono: "", codigoPermiso: "GESTION_OFERTAS"}, //TODO: Cambiar, nada mas q como aun no esta el listado, para probar puse esto
        { titulo: "Etapas", ruta: "/ofertas/etapas", icono: "", codigoPermiso: "GESTION_ETAPA_PERSONALIZADA"}
      ]
     },
    { titulo: "Empleados", ruta: "/empleados", icono: "badge", codigoPermiso: "GESTIONAR_EMPLEADOS" },
    //{ titulo: "Estadísticas", ruta: "/estadisticas", icono: "query_stats", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Panel de control", ruta: "", icono: "settings", 
      children: [
        { titulo: "Roles", ruta: "/gestion-de-roles", icono: "", codigoPermiso: "GESTIONAR_ROLES"},
        //{ titulo: "Backup", ruta: "/backup", icono: "", codigoPermiso: "BACKUP"}, //TODO: Falta
        { titulo: "Parámetros", ruta: "/parametros", icono: "", codigoPermiso: "PARAMETROS"}
      ]
     },
    { titulo: "Habilitaciones", ruta: "/habilitaciones", icono: "domain", codigoPermiso: "HABILITACION_EMPRESA" },
    { titulo: "Usuarios", ruta: "/usuarios", icono: "groups_2", codigoPermiso: "GESTIONAR_USUARIOS" },
    //{ titulo: "Calendario", ruta: "/calendario", icono: "", codigoPermiso: "" }, //TODO: Falta
    { titulo: "Postulaciones", ruta: "/postulaciones", icono: "trip", codigoPermiso: "POSTULAR_OFERTA" } //TODO: Falta
  ];
  }
  
}
