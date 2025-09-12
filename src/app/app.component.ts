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
  estaLogueado: boolean = false;

  sidebarVisible$!: Observable<boolean>;
  
  private sub!: Subscription;

  constructor(private sesionService: SesionService){}

  ngOnInit(): void {
    //this.estaLogueado = this.sesionService.isLoggedIn(); 
    this.sidebarVisible$ = this.sesionService.rolUsuario$.pipe(
      map(rol => !!rol)
    );
    // Suscripción a eventos de login/logout
    this.sub = this.sesionService.announced$.subscribe(event => {
      if (event === 'login') {
        this.estaLogueado = true;
      } else if (event === 'logout') {
        this.estaLogueado = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
