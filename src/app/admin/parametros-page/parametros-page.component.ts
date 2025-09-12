import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-parametros-page',
  imports: [],
  templateUrl: './parametros-page.component.html',
  styleUrl: './parametros-page.component.css'
})
export class ParametrosPageComponent {
  
  constructor(private router: Router) { }

  navegarA(parametro: string): void {
    this.router.navigate(['/parametros', parametro]);
    // Ejemplo: si el parámetro es 'paises-provincias', la URL será /parametros/paises-provincias
  }
}
