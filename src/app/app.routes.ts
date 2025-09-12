import { Routes } from '@angular/router';
import { ListadoProvinciasComponent } from './admin/ABMProvincia/listado-provincias/listado-provincias.component';
import { ListadoPaisesComponent } from './admin/ABMPais/listado-paises/listado-paises.component';
import { ListadoEstadosBusquedaLaboralComponent } from './admin/ABMEstadoBusquedaLaboral/listado-estados-busqueda-laboral/listado-estados-busqueda-laboral.component';
import { ListadoEstadosOfertaComponent } from './admin/ABMEstadoOferta/listado-estados-oferta/listado-estados-oferta.component';
import { ListadoEstadosUsuarioComponent } from './admin/ABMEstadoUsuario/listado-estados-usuario/listado-estados-usuario.component';
import { ListadoEtapasComponent } from './admin/ABMEtapa/listado-etapas/listado-etapas.component';
import { ListadoGenerosComponent } from './admin/ABMGenero/listado-generos/listado-generos.component';
import { ListadoHabilidadesComponent } from './admin/ABMHabilidad/listado-habilidades/listado-habilidades.component';
import { ListadoModalidadesComponent } from './admin/ABMModalidad/listado-modalidades/listado-modalidades.component';
import { ListadoRubrosComponent } from './admin/ABMRubro/listado-rubros/listado-rubros.component';
import { ListadoTiposContratoComponent } from './admin/ABMTipoContrato/listado-tipos-contrato/listado-tipos-contrato.component';
import { ListadoTiposEventoComponent } from './admin/ABMTipoEvento/listado-tipos-evento/listado-tipos-evento.component';
import { ListadoTiposHabilidadComponent } from './admin/ABMTipoHabilidad/listado-tipos-habilidad/listado-tipos-habilidad.component';
import { CrearEmpleadoComponent } from './modulos/empresa/empleados/crear-empleado/crear-empleado.component';
import { ListadoEmpleadosComponent } from './modulos/empresa/empleados/listado-empleados/listado-empleados.component';
import { PerfilEmpleadoComponent } from './modulos/empresa/empleados/perfil-empleado/perfil-empleado.component';

import { PerfilEmpresaComponent } from './modulos/empresa/empresa/perfil-empresa/perfil-empresa.component';
import { LoginPageComponent } from './modulos/seguridad/Login/login-page/login-page.component';
import { PerfilCandidatoComponent } from './modulos/candidato/perfil-candidato/perfil-candidato.component';
import { BusquedaCandidatosComponent } from './modulos/busqueda/busqueda-candidatos/busqueda-candidatos.component';
import { DetalleCandidatoComponent } from './modulos/busqueda/busqueda-candidatos/detalle-candidato/detalle-candidato.component';
import { BusquedaEmpresasComponent } from './modulos/busqueda/busqueda-empresas/busqueda-empresas.component';
import { DetalleEmpresaComponent } from './modulos/busqueda/busqueda-empresas/detalle-empresa/detalle-empresa.component';

import { RegistroEmpresaComponent } from './modulos/seguridad/Registro/Registro Empresa/registro-empresa.component';
import { RegistroComponent } from './modulos/seguridad/Registro/registro.component';
import { RegistroCandidatoComponent } from './modulos/seguridad/Registro/Registro Candidato/registro-candidato.component';
import { PaginaInicioComponent } from './compartidos/Pagina Incio/pagina-inicio.component';
import { ConfirmacionComponent } from './modulos/seguridad/Registro/Confirmacion/confirmacion.component';
import { ListadoUsuariosComponent } from './modulos/seguridad/usuarios/listado-usuarios/listado-usuarios.component';
import { DetalleUsuarioComponent } from './modulos/seguridad/usuarios/listado-usuarios/detalle-usuario/detalle-usuario.component';
import { RecuperarContraseniaComponent } from './modulos/seguridad/Recuperacion Contraseña/Recuperar contrasenia/recuperar-contrasenia.component';
import { GestionderolesComponent } from './modulos/seguridad/Gestion de roles/GDR Componente/gestion-de-roles.component';
import { HabilitacionEmpresasComponent } from './modulos/seguridad/habilitacion-empresas/habilitacion-empresas.component';
import { SidebarComponent } from './compartidos/SideBar/sidebar.component.component';

import { ParametrosPageComponent } from './admin/parametros-page/parametros-page.component';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';
import { DetalleEmpresaPendienteComponent } from './modulos/seguridad/habilitacion-empresas/detalle-empresa-pendiente/detalle-empresa-pendiente/detalle-empresa-pendiente.component';

import { BusquedaOfertasComponent } from './modulos/busqueda/busqueda-ofertas/busqueda-ofertas.component';
import { DetalleOfertaComponent } from './modulos/busqueda/busqueda-ofertas/detalle-oferta/detalle-oferta.component';

import { CrearOfertaComponent } from './modulos/gestion de ofertas/crear oferta/crear oferta component/crear-oferta.component';

export const routes: Routes = [
    // { path: 'buscar-ofertas', component: BuscarComponent },
    // { path: 'buscar-candidatos', component: BuscarComponent },
    // { path: 'buscar-empresas', component: BuscarComponent },
    // { path: 'panel-roles', component: PanelControlComponent },
    // { path: 'panel-parametros', component: PanelControlComponent },
    // { path: 'panel-backup', component: PanelControlComponent },
    // { path: 'habilitaciones', component: HabilitacionesComponent },
    // { path: 'usuarios', component: UsuariosComponent },
    // { path: 'estadisticas', component: EstadisticasComponent },
    { path: 'parametros', component: ParametrosPageComponent, canActivate: [authGuard] },
    { path: 'parametros/paises', component: ListadoPaisesComponent, canActivate: [authGuard] },
    { path: 'provincias/:idPais', component: ListadoProvinciasComponent, canActivate: [authGuard] },
    { path: 'parametros/generos', component: ListadoGenerosComponent, canActivate: [authGuard] },
    { path: 'parametros/estadosUsuario', component: ListadoEstadosUsuarioComponent, canActivate: [authGuard] },
    { path: 'parametros/tiposEvento', component: ListadoTiposEventoComponent, canActivate: [authGuard] },
    { path: 'parametros/tiposContrato', component: ListadoTiposContratoComponent, canActivate: [authGuard] },
    { path: 'parametros/estadosBusqueda', component: ListadoEstadosBusquedaLaboralComponent, canActivate: [authGuard] },
    { path: 'parametros/estadosOferta', component: ListadoEstadosOfertaComponent, canActivate: [authGuard] },
    { path: 'parametros/modalidades', component: ListadoModalidadesComponent, canActivate: [authGuard] },
    { path: 'parametros/tiposHabilidad', component: ListadoTiposHabilidadComponent, canActivate: [authGuard] },
    { path: 'parametros/rubros', component: ListadoRubrosComponent, canActivate: [authGuard] },
    { path: 'parametros/habilidades', component: ListadoHabilidadesComponent, canActivate: [authGuard] },
    { path: 'parametros/etapas', component: ListadoEtapasComponent, canActivate: [authGuard] },
    { path: 'empresas/perfil', component: PerfilEmpresaComponent, canActivate: [authGuard] },
    { path: 'empleados', component: ListadoEmpleadosComponent, canActivate: [authGuard] },
    { path: 'empleados/crear', component: CrearEmpleadoComponent, canActivate: [authGuard] },
    { path: 'empleados/perfil', component: PerfilEmpleadoComponent, canActivate: [authGuard] },
    { path: 'empleados/perfil/:idEmpleado', component: PerfilEmpleadoComponent, canActivate: [authGuard] },
    { path: 'inicio', component: PaginaInicioComponent, canActivate: [publicGuard] }, 

    { path: 'login', component: LoginPageComponent, canActivate: [publicGuard] },
    { path: 'candidato/perfil', component: PerfilCandidatoComponent, canActivate: [authGuard] },

    { path: 'registro', component: RegistroComponent, canActivate: [publicGuard]},
    { path: 'registro-empresa', component: RegistroEmpresaComponent, canActivate: [publicGuard] },
    { path: 'registro-candidato', component: RegistroCandidatoComponent, canActivate: [publicGuard] },
    { path: 'crear-oferta', component: CrearOfertaComponent},
    { path: 'cuentaVerificada', component: ConfirmacionComponent},

    { path: 'usuarios', component: ListadoUsuariosComponent, canActivate: [authGuard] },
    { path: 'usuarios/detalle/:idUsuario', component: DetalleUsuarioComponent, canActivate: [authGuard] },
    { path: 'habilitaciones', component: HabilitacionEmpresasComponent, canActivate: [authGuard] },
    { path: 'habilitaciones/detalle-empresa/:id', component: DetalleEmpresaPendienteComponent, canActivate: [authGuard] },

    { path: 'buscar-candidatos', component: BusquedaCandidatosComponent, canActivate: [authGuard] },
    { path: 'buscar-candidatos/detalle/:idCandidato', component: DetalleCandidatoComponent, canActivate: [authGuard] },
    { path: 'buscar-empresas', component: BusquedaEmpresasComponent, canActivate: [authGuard] },
    { path: 'buscar-empresas/detalle/:idEmpresa', component: DetalleEmpresaComponent, canActivate: [authGuard] },
    { path: 'nuevaContrasenia', component: RecuperarContraseniaComponent, canActivate: [authGuard]},
    { path: 'gestion-de-roles', component: GestionderolesComponent, canActivate: [authGuard]},

    { path: 'buscar-ofertas', component: BusquedaOfertasComponent },
    { path: 'buscar-ofertas/detalle/:idOferta', component: DetalleOfertaComponent },












































    {path: `side-bar`, component: SidebarComponent}
];
