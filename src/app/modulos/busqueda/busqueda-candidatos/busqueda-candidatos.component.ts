import { Component, OnInit } from '@angular/core';
import { BusquedaService } from '../busqueda.service';
import { ProvinciaService } from '../../../admin/ABMProvincia/provincia.service';
import { PaisService } from '../../../admin/ABMPais/pais.service';
import { HabilidadService } from '../../../admin/ABMHabilidad/habilidad.service';
import { Candidato } from '../../Candidato/candidato';
import { MultiSelect } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Habilidad } from '../../../admin/ABMHabilidad/habilidad';
import { EstadoBusquedaLaboral } from '../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral';
import { Pais } from '../../../admin/ABMPais/pais';
import { Provincia } from '../../../admin/ABMProvincia/provincia';
import { EstadoBusquedaLaboralService } from '../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-busqueda-candidatos',
  imports: [MultiSelect, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './busqueda-candidatos.component.html',
  styleUrl: './busqueda-candidatos.component.css'
})
export class BusquedaCandidatosComponent implements OnInit {
  
  candidatoList: Candidato[] = [];
  texto: string = '';

  busquedaRealizada: boolean = true;

  filtrosHabilidad: Habilidad[] = [];
  filtrosEstado: EstadoBusquedaLaboral[] = [];
  filtrosPais: Pais[] = [];
  filtrosProvincia: Provincia[] = [];

  filtrosSeleccionadosHabilidad: any[] = [];
  filtrosSeleccionadosEstado: any[] = [];
  filtrosSeleccionadosPais: any[] = [];
  filtrosSeleccionadosProvincia: any[] = [];

  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private busquedaService: BusquedaService,
    private habilidadService: HabilidadService,
    private estadoService: EstadoBusquedaLaboralService,
    private provinciaService: ProvinciaService,
    private paisService: PaisService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    window.addEventListener('beforeunload', () => {
      sessionStorage.clear();
    });

    const listaGuardada = sessionStorage.getItem('candidatoList');
    const textoGuardado = sessionStorage.getItem('texto');
    const filtrosHabilidadGuardados = sessionStorage.getItem('filtrosHabilidad');
    const filtrosEstadoGuardados = sessionStorage.getItem('filtrosEstado');
    const filtrosPaisGuardados = sessionStorage.getItem('filtrosPais');
    const filtrosProvinciaGuardados = sessionStorage.getItem('filtrosProvincia');

    if (listaGuardada) {
      this.candidatoList = JSON.parse(listaGuardada);
      console.log(this.candidatoList)
      this.busquedaRealizada = true;
    }

    if (textoGuardado) {
      this.texto = JSON.parse(textoGuardado);
    }

    if (filtrosHabilidadGuardados) {
      this.filtrosSeleccionadosHabilidad = JSON.parse(filtrosHabilidadGuardados);
    }

    if (filtrosEstadoGuardados) {
      this.filtrosSeleccionadosEstado = JSON.parse(filtrosEstadoGuardados);
    }

    if (filtrosPaisGuardados) {
      this.filtrosSeleccionadosPais = JSON.parse(filtrosPaisGuardados);
    }

    if (filtrosProvinciaGuardados) {
      this.filtrosSeleccionadosProvincia = JSON.parse(filtrosProvinciaGuardados);
    }

    this.habilidadService.findAllActivas().subscribe(data => {
      this.filtrosHabilidad = data;
      this.filtrosHabilidad = this.filtrosHabilidad.map(h => ({
        ...h,
        name: `${h.nombreHabilidad}`
      })
      )
    })
    
    this.estadoService.findAllActivos().subscribe(data => {
      this.filtrosEstado = data;
      this.filtrosEstado = this.filtrosEstado.map(e => ({
        ...e,
        name: `${e.nombreEstadoBusqueda}`
      })
      )
    })
    
    this.paisService.findAllActivos().subscribe(data => {
      this.filtrosPais = data;
      this.filtrosPais = this.filtrosPais.map(pa => ({
        ...pa,
        name: `${pa.nombrePais}`
      })
      )
    })
    
  }

  buscarPorNombre(texto: string): void {
    this.busquedaRealizada = true;
    this.busquedaService.buscarCandidatosPorNombre(texto).subscribe(data => {
      this.candidatoList = data;
      sessionStorage.setItem('texto',JSON.stringify(this.texto));
      sessionStorage.setItem('candidatoList', JSON.stringify(this.candidatoList));
      sessionStorage.setItem('filtrosHabilidad', JSON.stringify(this.filtrosSeleccionadosHabilidad));
      sessionStorage.setItem('filtrosEstado', JSON.stringify(this.filtrosSeleccionadosEstado));
      sessionStorage.setItem('filtrosPais', JSON.stringify(this.filtrosSeleccionadosPais));
      sessionStorage.setItem('filtrosProvincia', JSON.stringify(this.filtrosSeleccionadosProvincia));
    });
  }

  filtrarEmpresas() {
    const idsHabilidades = this.filtrosSeleccionadosHabilidad?.length ? this.filtrosSeleccionadosHabilidad : null;
    const idsPaises = this.filtrosSeleccionadosPais?.length ? this.filtrosSeleccionadosPais : null;
    const idsProvincias = this.filtrosSeleccionadosProvincia?.length ? this.filtrosSeleccionadosProvincia : null;
    const idsEstadosDeBusqueda = this.filtrosSeleccionadosEstado?.length ? this.filtrosSeleccionadosEstado : null;
    console.log("paises:", idsPaises);
    console.log("estados", idsEstadosDeBusqueda);
    console.log("habilidades", idsHabilidades);
    this.busquedaRealizada = true;
    this.busquedaService.filtrarCandidatos(this.texto, idsProvincias, idsPaises, idsHabilidades, idsEstadosDeBusqueda).subscribe(data => {
      this.candidatoList = data;
      sessionStorage.setItem('texto',JSON.stringify(this.texto));
      sessionStorage.setItem('candidatoList', JSON.stringify(this.candidatoList));
      sessionStorage.setItem('filtrosHabilidad', JSON.stringify(this.filtrosSeleccionadosHabilidad));
      sessionStorage.setItem('filtrosEstado', JSON.stringify(this.filtrosSeleccionadosEstado));
      sessionStorage.setItem('filtrosPais', JSON.stringify(this.filtrosSeleccionadosPais));
      sessionStorage.setItem('filtrosProvincia', JSON.stringify(this.filtrosSeleccionadosProvincia));
    })
  }

  onCambiarPais(): void {
    this.filtrosProvincia = [];

    if (this.filtrosSeleccionadosPais?.length) {
      console.log(this.filtrosSeleccionadosPais)
      const observables = this.filtrosSeleccionadosPais.map((idPais: number) =>
        this.provinciaService.getProvinciasPorPais(idPais)
      );

      // con forkjoin, se espera que se devuelvan todas las llamadas
      forkJoin(observables).subscribe((provinciasPorPaisArray: Provincia[][]) => {
        const todasProvincias = provinciasPorPaisArray.flat();

        const provinciasUnicas = todasProvincias.filter(
          (provincia, index, self) =>
            index === self.findIndex(p => p.id === provincia.id)
        );

        this.filtrosProvincia = provinciasUnicas.map(p => ({
          ...p,
          name: p.nombreProvincia
        }));
      });
    }
  }
  
  irADetalle(idCandidato: number) {
    this.router.navigate([`buscar-candidatos/detalle`,idCandidato]);
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.candidatoList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerCandidatosPaginados(): Candidato[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.candidatoList.slice(inicio, fin);
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
