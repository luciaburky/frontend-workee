// import { Component, OnInit } from '@angular/core';
// import { OfertaService } from '../../oferta/oferta.service';
// import { Oferta } from '../../oferta/oferta';
// import { EmpresaService } from '../../empresa/empresa/empresa.service';
// import { EstadoOferta } from '../../../admin/ABMEstadoOferta/estado-oferta';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-visualizar-ofertas-propias',
//   standalone: true,                 // <- IMPORTANTE
//   imports: [CommonModule],
//   templateUrl: './visualizar-ofertas-propias.component.html',
//   styleUrl: './visualizar-ofertas-propias.component.css'
// })
// export class VisualizarOfertasPropiasComponent implements OnInit {

//   agregarEtapa() {
//     throw new Error('Method not implemented.');
//   }

//   ofertas: Oferta[] = [];
//   ofertasObtenidas: Oferta[] = [];
//   idEmpresaObtenida!: number;

//   // NO hace falta un array global de estados: cada oferta ya trae estadosOferta
//   // estados: EstadoOferta[] = [];  // <- podés borrar si no lo usás

//   constructor(
//     private ofertaService: OfertaService,
//     private empresaService: EmpresaService,
//   ) {}

//   ngOnInit(): void {
//     if (this.empresaService) {
//       console.log('entra a empresa service');
//       this.empresaService.getidEmpresabyCorreo()?.subscribe({
//         next: (idEmpresa) => {
//           if (idEmpresa !== undefined && idEmpresa !== null) {
//             this.idEmpresaObtenida = idEmpresa;
//             console.log('id empresa obtenido: ', idEmpresa);
//             this.ofertaService.getOfertasPorEmpresa(idEmpresa).subscribe({
//               next: (ofertas) => {
//                 this.ofertasObtenidas = ofertas;
//                 console.log('Ofertas disponibles: ', this.ofertasObtenidas);
//                 this.ofertasObtenidas = ofertas.map(i => ({
//                   ...i,
//                   // opcional: agregá un campo derivado para mostrar fácil
//                   estadoNombre: this.getEstadoActual(i)?.nombreEstadoOferta ?? '—',
//                 }) as any);
//               },
//               error: (err) => {
//                 console.error('Error al obtener ofertas disponibles', err);
//               }
//             });
//           } else {
//             console.error('El id de empresa obtenido es undefined o null');
//           }
//         },
//         error: (err) => {
//           console.error('Error al obtener id de empresa por correo', err);
//         }
//       });
//     }
//   }


//   getEstadoActual(oferta: Oferta): EstadoOferta | null {
//   const lista = oferta.estadosOferta ?? []; //En realidad recorre OfertaEstadoOferta de la oferta que le pase
//   if (!lista.length) return null;

//   // 1) preferí el registro vigente (sin fecha de baja)
//   const vigente = lista.find(e => !e.fechaHoraBaja);
//   if (vigente?.estadoOferta) return vigente.estadoOferta; //Devuelve el OfertaEstadoOferta que no tenga la fechaHoraBaja

//   // 2) si no hay vigente, tomá el último por fecha de alta
//   const ordenados = [...lista].sort((a, b) =>
//     new Date(a.fechaHoraAlta ?? 0).getTime() - new Date(b.fechaHoraAlta ?? 0).getTime() //Devuelve el OfertaEstadoOferta con le fecha fechaHoraAlta mas nueva
//   );
//   return ordenados.at(-1)?.estadoOferta ?? null;
// }


// estadoClase(oferta: Oferta): string {
//   const cod = (this.getEstadoActual(oferta)?.codigo ?? '').toUpperCase();
//   switch (cod) {
//     case 'ABIERTA':     return 'is-abierta';
//     case 'CERRADA':     return 'is-cerrada';
//     case 'FINALIZADA':  return 'is-finalizada';
//     default:            return 'is-neutro';
//   }
// }

// estadoTexto(oferta: Oferta): string {
//   return this.getEstadoActual(oferta)?.nombreEstadoOferta ?? 'Sin estado';
// }



// }

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';

import { MultiSelect } from 'primeng/multiselect'; // <-- NUEVO

import { OfertaService } from '../../oferta/oferta.service';
import { Oferta } from '../../oferta/oferta';
import { EmpresaService } from '../../empresa/empresa/empresa.service';
import { EstadoOferta } from '../../../admin/ABMEstadoOferta/estado-oferta';
import { Router, RouterModule } from '@angular/router';

type OpcionEstado = { code: string; name: string };

@Component({
  selector: 'app-visualizar-ofertas-propias',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelect, RouterModule], // <-- AGREGA MultiSelect
  templateUrl: './visualizar-ofertas-propias.component.html',
  styleUrl: './visualizar-ofertas-propias.component.css'
})
export class VisualizarOfertasPropiasComponent implements OnInit {

  agregarEtapa() { throw new Error('Method not implemented.'); }

  /** Lista completa traída del backend (de tu empresa) */
  ofertasObtenidas: Oferta[] = [];

  /** Lista que se muestra (filtrada) */
  ofertas: Oferta[] = [];

  /** buscador de texto */
  textoOferta: string = '';

  /** === Filtro EstadoOferta === */
  filtrosEstadoOferta: OpcionEstado[] = [];               // opciones únicas disponibles
  filtrosSeleccionadosEstadoOferta: string[] = [];        // array de codes (p. ej. ['ABIERTA','CERRADA'])

  idEmpresaObtenida!: number;
  private isBrowser = false; // para SSR-safe sessionStorage

  constructor(
    private ofertaService: OfertaService,
    private empresaService: EmpresaService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // restaurar texto/estados si hay (SSR-safe)
    if (this.isBrowser) {
      const txt = sessionStorage.getItem('textoOfertaPropias');
      if (txt) this.textoOferta = JSON.parse(txt);

      const est = sessionStorage.getItem('estadosOfertaSeleccionados');
      if (est) this.filtrosSeleccionadosEstadoOferta = JSON.parse(est);
    }

    if (this.empresaService) {
      console.log('entra a empresa service');
      this.empresaService.getidEmpresabyCorreo()?.subscribe({
        next: (idEmpresa) => {
          if (idEmpresa !== undefined && idEmpresa !== null) {
            this.idEmpresaObtenida = idEmpresa;
            console.log('id empresa obtenido: ', idEmpresa);

            this.ofertaService.getOfertasPorEmpresa(idEmpresa).subscribe({
              next: (ofertas) => {
                // mapeo + campo derivado opcional
                this.ofertasObtenidas = ofertas.map(i => ({
                  
                  ...i,
                  estadoNombre: this.getEstadoActual(i)?.nombreEstadoOferta ?? '—',
                }) as any);
                
                

                // construir opciones únicas de estado (en base al estado vigente de cada oferta)
                this.cargarOpcionesEstados();

                // aplicar filtros (texto + estados) si había algo guardado
                this.aplicarFiltro();

                console.log('Ofertas disponibles: ', this.ofertasObtenidas);
              },
              error: (err) => console.error('Error al obtener ofertas disponibles', err)
            });
          } else {
            console.error('El id de empresa obtenido es undefined o null');
          }
        },
        error: (err) => console.error('Error al obtener id de empresa por correo', err)
      });
    }
  }

  /** Construye el combo de estados a partir del estado vigente de cada oferta */
  private cargarOpcionesEstados(): void {
    const mapa = new Map<string, string>(); // code -> name

    for (const o of this.ofertasObtenidas) {
      const est = this.getEstadoActual(o);
      const code = (est?.codigo ?? '').toUpperCase();
      const name = est?.nombreEstadoOferta ?? '';
      if (code && name && !mapa.has(code)) {
        mapa.set(code, name);
      }
    }

    // opcional: incluir "Sin estado" si hay alguna oferta sin estado vigente
    const haySinEstado = this.ofertasObtenidas.some(o => !this.getEstadoActual(o));
    if (haySinEstado) {
      mapa.set('__NONE__', 'Sin estado');
    }

    this.filtrosEstadoOferta = Array.from(mapa.entries()).map(([code, name]) => ({ code, name }));
  }

  private norm(s: string): string {
    return (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  /** === BUSCADOR SOLO TEXTO === */
  buscarPorNombre(texto: string): void {
    this.textoOferta = texto ?? '';
    if (this.isBrowser) {
      sessionStorage.setItem('textoOfertaPropias', JSON.stringify(this.textoOferta));
    }
    this.aplicarFiltro();
  }

  /** Dispara al cambiar selección de estados */
  onEstadosChange(): void {
    if (this.isBrowser) {
      sessionStorage.setItem('estadosOfertaSeleccionados', JSON.stringify(this.filtrosSeleccionadosEstadoOferta));
    }
    this.aplicarFiltro();
  }

  /** Aplica filtros locales: texto + estado vigente */
  private aplicarFiltro(): void {
    const t = this.norm(this.textoOferta);
    const seleccionados = (this.filtrosSeleccionadosEstadoOferta ?? []).map(s => (s ?? '').toUpperCase());

    this.ofertas = this.ofertasObtenidas.filter(o => {
      const coincideTexto = !t || this.norm(o.titulo).includes(t);
      if (!coincideTexto) return false;

      if (!seleccionados.length) return true; // sin filtro de estado

      const vigenteCode = (this.getEstadoActual(o)?.codigo ?? '__NONE__').toUpperCase();
      return seleccionados.includes(vigenteCode);
    });
  }

  /** ======= utilidades de estado (sin cambios de lógica) ======= */
  getEstadoActual(oferta: Oferta): EstadoOferta | null {
    const lista = (oferta as any).estadosOferta ?? [];
    if (!lista.length) return null;

    const vigente = lista.find((e: any) => !e.fechaHoraBaja);
    if (vigente?.estadoOferta) return vigente.estadoOferta;

    const ordenados = [...lista].sort((a: any, b: any) =>
      new Date(a.fechaHoraAlta ?? 0).getTime() - new Date(b.fechaHoraAlta ?? 0).getTime()
    );
    return ordenados.at(-1)?.estadoOferta ?? null;
  }

  estadoClase(oferta: Oferta): string {
    const cod = (this.getEstadoActual(oferta)?.codigo ?? '').toUpperCase();
    switch (cod) {
      case 'ABIERTA':     return 'is-abierta';
      case 'CERRADA':     return 'is-cerrada';
      case 'FINALIZADA':  return 'is-finalizada';
      default:            return 'is-neutro';
    }
  }

  estadoTexto(oferta: Oferta): string {
    return this.getEstadoActual(oferta)?.nombreEstadoOferta ?? 'Sin estado';
  }

  irADetalle(id: number): void {
    this.router.navigate(['/visualizar-oferta', id]);
  }

  getFechaUltimaActualizacion(oferta: Oferta){
    const estadoVigente = oferta.estadosOferta.find(eo => eo.fechaHoraBaja == null);
    return estadoVigente?.fechaHoraAlta ?? null;
  }
}
