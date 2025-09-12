import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../empleado.service';
import { Empleado } from '../empleado';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-empleados',
  imports: [CommonModule],
  templateUrl: './listado-empleados.component.html',
  styleUrl: './listado-empleados.component.css'
})
export class ListadoEmpleadosComponent implements OnInit {
  
  cantEmpleadosActivos!: number;
  empleadoList: Empleado[] = [];
  paginaActual: number = 1;
  elementosPorPagina: number = 8;
  
  constructor(
    private empleadoService: EmpleadoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.empleadoService.cantidadActivos().subscribe(cantidad => {
      this.cantEmpleadosActivos = cantidad;
    })
    //console.log("id empresa " + )
    // this.empleadoService.findAll().subscribe(empleados => {
    //   this.empleadoList = empleados;
    // })
  }

  crearEmpleado(): void {
    this.router.navigate([`empleados/crear`]);
  }
  
  visualizarEmpleado(idEmpleado: number) {
    // this.empleadoService.setId(idEmpleado);
    this.router.navigate([`empleados/perfil`,idEmpleado]);
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.empleadoList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerEmpleadosPaginados(): Empleado[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    // console.log(inicio);
    const fin = inicio + this.elementosPorPagina;
    // console.log(fin);
    // console.log(this.empleadoList.slice(inicio, fin));
    return this.empleadoList.slice(inicio, fin);
  }

  avanzarPagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }
  
  retrocederPagina(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }
}
