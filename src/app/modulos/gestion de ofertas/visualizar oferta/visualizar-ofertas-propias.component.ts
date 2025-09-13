// import { Component, OnInit } from '@angular/core';
// import { OfertaService } from '../../oferta/oferta.service';
// import { Oferta } from '../../oferta/oferta';
// import { EmpresaService } from '../../empresa/empresa/empresa.service';
// import { EstadoOferta } from '../../../admin/ABMEstadoOferta/estado-oferta';

// @Component({
//   selector: 'app-visualizar-ofertas-propias',
//   imports: [],
//   templateUrl: './visualizar-ofertas-propias.component.html',
//   styleUrl: './visualizar-ofertas-propias.component.css'
// })
// export class VisualizarOfertasPropiasComponent implements OnInit{

// agregarEtapa() {
// throw new Error('Method not implemented.');
// }

//   ofertas: Oferta[] = [];
//   ofertasObtenidas: Oferta [] = [];
//   idEmpresaObtenida!: number;

//   estados: EstadoOferta [] = [];
//   estadosObtenidos: EstadoOferta [ ]=[];

//   constructor(
//     private ofertaService: OfertaService,
//     private empresaService: EmpresaService,
//   ) { 
    
//   }

//   ngOnInit(): void {

//   if (this.empresaService) {
//     console.log('entra a empresa service')
//     this.empresaService.getidEmpresabyCorreo()?.subscribe({
//         next: (idEmpresa) => {
//           if (idEmpresa !== undefined && idEmpresa !== null) {
//             this.idEmpresaObtenida = idEmpresa;
//             console.log('id empresa obtenido: ', idEmpresa)
//             this.ofertaService.getOfertasPorEmpresa(idEmpresa).subscribe({
//               next: (ofertas) => {
//                 this.ofertasObtenidas = ofertas;
//                 console.log('Ofertas disponibles: ', this.ofertasObtenidas)
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
//     });
//   }
// }




// }


import { Component, OnInit } from '@angular/core';
import { OfertaService } from '../../oferta/oferta.service';
import { Oferta } from '../../oferta/oferta';
import { EmpresaService } from '../../empresa/empresa/empresa.service';
import { EstadoOferta } from '../../../admin/ABMEstadoOferta/estado-oferta';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-ofertas-propias',
  standalone: true,                 // <- IMPORTANTE
  imports: [CommonModule],
  templateUrl: './visualizar-ofertas-propias.component.html',
  styleUrl: './visualizar-ofertas-propias.component.css'
})
export class VisualizarOfertasPropiasComponent implements OnInit {

  agregarEtapa() {
    throw new Error('Method not implemented.');
  }

  ofertas: Oferta[] = [];
  ofertasObtenidas: Oferta[] = [];
  idEmpresaObtenida!: number;

  // NO hace falta un array global de estados: cada oferta ya trae estadosOferta
  // estados: EstadoOferta[] = [];  // <- podés borrar si no lo usás

  constructor(
    private ofertaService: OfertaService,
    private empresaService: EmpresaService,
  ) {}

  ngOnInit(): void {
    if (this.empresaService) {
      console.log('entra a empresa service');
      this.empresaService.getidEmpresabyCorreo()?.subscribe({
        next: (idEmpresa) => {
          if (idEmpresa !== undefined && idEmpresa !== null) {
            this.idEmpresaObtenida = idEmpresa;
            console.log('id empresa obtenido: ', idEmpresa);
            this.ofertaService.getOfertasPorEmpresa(idEmpresa).subscribe({
              next: (ofertas) => {
                this.ofertasObtenidas = ofertas;
                console.log('Ofertas disponibles: ', this.ofertasObtenidas);
                this.ofertasObtenidas = ofertas.map(i => ({
                  ...i,
                  // opcional: agregá un campo derivado para mostrar fácil
                  estadoNombre: this.getEstadoActual(i)?.nombreEstadoOferta ?? '—',
                }) as any);
              },
              error: (err) => {
                console.error('Error al obtener ofertas disponibles', err);
              }
            });
          } else {
            console.error('El id de empresa obtenido es undefined o null');
          }
        },
        error: (err) => {
          console.error('Error al obtener id de empresa por correo', err);
        }
      });
    }
  }


  getEstadoActual(oferta: Oferta): EstadoOferta | null {
  const lista = oferta.estadosOferta ?? []; //En realidad recorre OfertaEstadoOferta de la oferta que le pase
  if (!lista.length) return null;

  // 1) preferí el registro vigente (sin fecha de baja)
  const vigente = lista.find(e => !e.fechaHoraBaja);
  if (vigente?.estadoOferta) return vigente.estadoOferta; //Devuelve el OfertaEstadoOferta que no tenga la fechaHoraBaja

  // 2) si no hay vigente, tomá el último por fecha de alta
  const ordenados = [...lista].sort((a, b) =>
    new Date(a.fechaHoraAlta ?? 0).getTime() - new Date(b.fechaHoraAlta ?? 0).getTime() //Devuelve el OfertaEstadoOferta con le fecha fechaHoraAlta mas nueva
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



}