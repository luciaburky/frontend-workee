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
    { path: 'paises', component: ListadoPaisesComponent },
    { path: 'provincias/:idPais', component: ListadoProvinciasComponent },
    { path: 'generos', component: ListadoGenerosComponent },
    { path: 'estadosUsuario', component: ListadoEstadosUsuarioComponent },
    { path: 'tiposEvento', component: ListadoTiposEventoComponent },
    { path: 'tiposContrato', component: ListadoTiposContratoComponent },
    { path: 'estadosBusqueda', component: ListadoEstadosBusquedaLaboralComponent },
    { path: 'estadosOferta', component: ListadoEstadosOfertaComponent },
    { path: 'modalidades', component: ListadoModalidadesComponent },
    { path: 'tiposHabilidad', component: ListadoTiposHabilidadComponent },
    { path: 'rubros', component: ListadoRubrosComponent },
    { path: 'habilidades', component: ListadoHabilidadesComponent },
    { path: 'etapas', component: ListadoEtapasComponent },
    { path: 'empresas/perfil/:id', component: PerfilEmpresaComponent },
    { path: 'empleados', component: ListadoEmpleadosComponent },
    { path: 'empleados/crear', component: CrearEmpleadoComponent },
    { path: 'empleados/perfil/:idEmpleado', component: PerfilEmpleadoComponent }
    { path: 'login', component: LoginPageComponent }
];
