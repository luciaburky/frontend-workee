import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./compartidos/SideBar/sidebar.component.component";
import { SesionService } from './interceptors/sesion.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular-app';
  estaLogueado: boolean | null = null;
  constructor(private sesionService: SesionService){}

  ngOnInit(): void {
    this.estaLogueado = this.sesionService.isLoggedIn();   
  }

  

}
