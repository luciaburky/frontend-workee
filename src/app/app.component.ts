import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./compartidos/SideBar/sidebar.component.component";
import { SesionService } from './interceptors/sesion.service';
import { map, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular-app';

  sidebarVisible$!: Observable<boolean>;
  
  private sub!: Subscription;

  constructor(private sesionService: SesionService){}

  ngOnInit(): void {
    this.sesionService.cargarRolUsuarioSinRedireccion();

    //this.estaLogueado = this.sesionService.isLoggedIn(); 
    this.sidebarVisible$ = this.sesionService.rolUsuario$.pipe(
      map(rol => !!rol)
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
