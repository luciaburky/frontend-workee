import { Component, OnInit } from '@angular/core';
import { BusquedaService } from '../busqueda.service';
import { FiltroUbicacion } from './filtro-ubicacion';
import { Empresa } from '../../empresa/empresa/empresa';
import { MultiSelect } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { RubroService } from '../../../admin/ABMRubro/rubro.service';
import { Rubro } from '../../../admin/ABMRubro/rubro';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-busqueda-empresas',
  imports: [MultiSelect, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './busqueda-empresas.component.html',
  styleUrl: './busqueda-empresas.component.css'
})
export class BusquedaEmpresasComponent implements OnInit{
  
  filtrosUbicacion: FiltroUbicacion[] = [];
  filtrosRubro: Rubro[] = [];
  filtrosOferta: string[] = [
    "Sí", "No"
  ];

  empresaListOriginal: Empresa[] = [];
  empresaList: Empresa[] = [];

  texto: string = '';

  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  filtrosSeleccionadosUbicacion: any[] = [];
  filtrosSeleccionadosRubros: any[] = [];
  filtrosSeleccionadosOfertas: any[] = [];
  busquedaRealizada: boolean = false; // se agrega esta variable para controlar si se ha realizado una búsqueda

  // VARIABLES QUE SE VAN A USAR CUANDO AGREGUEMOS LO DE OFERTAS
  tieneOfertasAbiertas: boolean = false;
  cantidadOfertasAbiertas: number = 0;

  constructor(
    private busquedaService: BusquedaService,
    private rubroService: RubroService
  ) {}
  
  ngOnInit(): void {
    this.busquedaService.filtroUbicacion().subscribe(data => {
      this.filtrosUbicacion = data;
      this.filtrosUbicacion = this.filtrosUbicacion.map(f => ({
        ...f,
        name: `${f.nombreProvincia}, ${f.nombrePais}`
      })
      )
    })

    this.rubroService.findAllActivos().subscribe(data => {
      this.filtrosRubro = data;
      this.filtrosRubro = this.filtrosRubro.map(r => ({
        ...r,
        name: `${r.nombreRubro}`
      })
    )
    })
  }

  buscarPorNombre(texto: string): void {
    this.busquedaRealizada = true;
    this.busquedaService.buscarPorNombre(texto).subscribe(data => {
      this.empresaList = data;
      console.log("empresas que coinciden con el texto ", texto, ": ", this.empresaList);
    });
  }
  
  filtrarEmpresas() {
    const idsProvincias = this.filtrosSeleccionadosUbicacion?.length ? this.filtrosSeleccionadosUbicacion : null;
    const idsRubros = this.filtrosSeleccionadosRubros?.length ? this.filtrosSeleccionadosRubros : null;

    this.busquedaRealizada = true;
    this.busquedaService.filtrarEmpresas(this.texto, idsRubros, idsProvincias).subscribe(data => {
      this.empresaList = data;
    })
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.empresaList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerEmpresasPaginadas(): Empresa[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.empresaList.slice(inicio, fin);
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
