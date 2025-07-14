import { Routes } from '@angular/router';
import { ListadoPaisesComponent } from './admin/ABMPais/listado-paises/listado-paises.component';
import { ListadoProvinciasComponent } from './admin/ABMProvincia/listado-provincias/listado-provincias.component';
import { ListadoGenerosComponent } from './admin/ABMGenero/listado-generos/listado-generos.component';
import { ListadoEstadosUsuarioComponent } from './admin/ABMEstadoUsuario/listado-estados-usuario/listado-estados-usuario.component';
import { ListadoTiposEventoComponent } from './admin/ABMTipoEvento/listado-tipos-evento/listado-tipos-evento.component';

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

];
