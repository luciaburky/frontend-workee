import { Component, OnInit } from '@angular/core';
import { AdministradorService } from './administrador.service';
import { Empresa } from '../../empresa/empresa/empresa';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habilitacion-empresas',
  imports: [CommonModule],
  templateUrl: './habilitacion-empresas.component.html',
  styleUrl: './habilitacion-empresas.component.css'
})
export class HabilitacionEmpresasComponent implements OnInit {
  
  empresas: Empresa[] = [];
    
  paginaActual: number = 1;
  elementosPorPagina: number = 10;


  constructor(
    private administradorService: AdministradorService
  ) {}
  
  ngOnInit(): void {
    this.administradorService.getEmpresasPorHabilitar().subscribe(data => {
      this.empresas = data;
    })
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.empresas.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerEmpresasPaginadas(): Empresa[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.empresas.slice(inicio, fin);
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
