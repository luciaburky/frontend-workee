import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Router, RouterModule } from '@angular/router';
import { SesionService } from '../../interceptors/sesion.service';
import { PermisoService } from '../../modulos/seguridad/Gestion de roles/permiso.service';
import { permiso } from '../../modulos/seguridad/Gestion de roles/permiso';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.component.html',
  styleUrls: ['./sidebar.component.component.css'],
  imports:[CommonModule,RouterModule]
})
export class SidebarComponent implements OnInit {

  menuItems: any[] = [];
  permisosUsuario: permiso[] = [];

  constructor(
    private sideBarService: SidebarService,
    private router: Router,
    private sesionService: SesionService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    // Cargamos el rol apenas entra
    this.sesionService.cargarRolUsuario();
    this.cargarPermisos();
  }

  logout(){

  }


  toggleSubmenu(item: any) {
    item.open = !item.open;
  }

  private puedeMostrar(item: any): boolean {
    // Si el item tiene un permiso propio → chequeamos
    if (item.codigoPermiso) {
      return this.permisosUsuario.some(p => p.codigoPermiso === item.codigoPermiso);
    }

    // Si no tiene permiso pero tiene hijos → al menos un hijo debe poder mostrarse
    if (item.children && item.children.length > 0) {
      return item.children.some((child: any) => this.puedeMostrar(child));
    }

    // Si no tiene permiso ni hijos → no se muestra
    return false;
  }

  private cargarPermisos(){
    this.sesionService.rolUsuario$.subscribe((rol) => {
      if (rol) {
        // Con el rol.id, traemos los permisos
        this.permisoService.permisosdeunRol(rol.id!).subscribe({
          next: (permisos: permiso[]) => {
            this.permisosUsuario = permisos;
            console.log(this.permisosUsuario)

            // Filtramos el menú en base a los permisos
            this.menuItems = this.sideBarService.menu.filter(item =>
              this.puedeMostrar(item)
            );
          },
          error: (err) => {
            console.error("Error al obtener permisos:", err);
          }
        });
      }
    });
  }

}
