import { Routes } from '@angular/router';
import { BuscarComponent } from './buscar/buscar.component';
import { PanelControlComponent } from './panel-control/panel-control.component';
import { HabilitacionesComponent } from './habilitaciones/habilitaciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ListadoPaisesComponent } from './admin/ABMPais/listado-paises/listado-paises.component';

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
    { path: 'paises', component: ListadoPaisesComponent }
];
