import { Component } from '@angular/core';
import { NavbarloginComponent } from '../../modulos/seguridad/Login/navbarlogin/navbarlogin.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagina-inicio',
  standalone: true, // 👈🏼 Importante si estás usando imports directos como `NavbarloginComponent`
  imports: [NavbarloginComponent, RouterModule],
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css'] 
})
export class PaginaInicioComponent { }
