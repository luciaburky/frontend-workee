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
    // Suscribirse al rol actual
    this.sesionService.rolUsuario$.subscribe((rol) => {
      if (rol) {
        // Con el rol.id, traemos los permisos
        this.permisoService.permisosdeunRol(rol.id!).subscribe({
          next: (permisos: permiso[]) => {
            this.permisosUsuario = permisos;
            console.log(this.permisosUsuario)

            // Filtramos el menú en base a los permisos
            this.menuItems = this.sideBarService.menu.filter(item =>
              this.permisosUsuario.some(p => p.codigoPermiso === item.codigoPermiso)
            );
          },
          error: (err) => {
            console.error("Error al obtener permisos:", err);
          }
        });
      }
    });

    // Cargamos el rol apenas entra
    this.sesionService.cargarRolUsuario();
  }

  logout(){

  }
}
