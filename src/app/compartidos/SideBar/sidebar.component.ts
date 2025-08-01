import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from './menu-item';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() role: string = 'admin'; //TODO: cambiarlo

  expandedMenus: Set<String> = new Set();

  menuItems: MenuItem[] = [
    {
      label: 'Buscar',
      icon: 'search', // lupa
      children: [
        { label: 'Ofertas', route: '/ofertas'},
        { label: 'Empresas', route: '/empresas' },
        { label: 'Candidatos', route: '/candidatos' }
      ],
      roleVisibleFor: ['admin'],
    },
    {
      label: 'Panel de control',
      icon: 'settings', // ruedita
      children: [
        { label: 'Roles', route: '/roles'},
        { label: 'Parámetros', route: '/paises' },
        { label: 'Backup', route: '/backup' }
      ],
      roleVisibleFor: ['admin'],
    },
    {
      label: 'Habilitaciones',
      icon: 'domain', // edificio / empresa
      route: '/habilitaciones',
      roleVisibleFor: ['admin']
    },
    {
      label: 'Usuarios',
      icon: 'groups_2', // usuario
      route: '/usuarios',
      roleVisibleFor: ['admin']
    },
    {
      label: 'Estadísticas',
      icon: 'query_stats', // estadísticas
      route: '/estadisticas',
      roleVisibleFor: ['admin']
    }
  ];

  isVisible(item: MenuItem): boolean {
    return !item.roleVisibleFor || item.roleVisibleFor.includes(this.role);
  }

  toggleExpand(label: string){
    if(this.expandedMenus.has(label)){
      this.expandedMenus.delete(label);
    } else {
      this.expandedMenus.add(label);
    }
  }

  isExpanded(label: string): boolean {
    return this.expandedMenus.has(label);
  }

}
