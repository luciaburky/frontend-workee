import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./compartidos/SideBar/sidebar.component.component";
import { SesionService } from './interceptors/sesion.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular-app';
  estaLogueado: boolean = false;
  private sub!: Subscription;

  constructor(private sesionService: SesionService){}

  ngOnInit(): void {
    this.estaLogueado = this.sesionService.isLoggedIn(); 
    
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
