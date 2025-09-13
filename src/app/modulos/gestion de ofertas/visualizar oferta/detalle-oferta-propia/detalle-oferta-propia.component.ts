import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfertaService } from '../../../oferta/oferta.service';
import { Oferta } from '../../../oferta/oferta';
import { EstadoOfertaService } from './../../../../admin/ABMEstadoOferta/estado-oferta.service';
import { EstadoOferta } from './../../../../admin/ABMEstadoOferta/estado-oferta';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-oferta-propia',
  imports: [DatePipe, CommonModule,RouterModule],
  templateUrl: './detalle-oferta-propia.component.html',
  styleUrl: './detalle-oferta-propia.component.css'
})
export class DetalleOfertaPropiaComponent implements OnInit {
  id?: number;
  oferta?: Oferta;
  estadoActual?: EstadoOferta;
  estadosDisponibles: EstadoOferta[] = [];

  constructor(
    private route: ActivatedRoute,
    private ofertaService: OfertaService,
    private estadoOfertaService: EstadoOfertaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarOferta();
    this.cargarEstados();
  }

  private cargarOferta() {
    this.ofertaService.getOferta(this.id!).subscribe(data => {
      this.oferta = data;

      const vigente = this.oferta.estadosOferta.find(
        (e: any) => e.fechaHoraBaja === null
      );

      if (vigente) {
        const codigo = vigente.estadoOferta.codigo;
        const nombre = vigente.estadoOferta.nombreEstadoOferta;
        const validos = ["ABIERTA", "CERRADA", "FINALIZADA"];

        if (validos.includes(codigo)) {
          this.estadoActual = {
            ...vigente.estadoOferta,
            codigo: codigo,
            nombreEstadoOferta: nombre
          };
        } else {
          this.estadoActual = undefined;
        }
      }
    });
  }

  private cargarEstados() {
    this.estadoOfertaService.findAllActivos().subscribe(data => {
      this.estadosDisponibles = data;
    });
  }

  cambiarEstadoOferta(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value;
    console.log("nuevo estado desde el metodo cambiarEstado:",nuevoEstado)
    
    Swal.fire({
      title: "¿Desea cambiar el estado de la oferta?",
        text: "Esta acción no se puede deshacer.",
        icon: "question",
        iconColor: "#31A5DD",
        showCancelButton: true,
        confirmButtonColor: "#31A5DD",
        cancelButtonColor: "#697077",
        confirmButtonText: "Sí, cambiar",
        cancelButtonText: "No, volver",
        reverseButtons: true,
        customClass: {
          title: 'titulo-chico',
        }
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log("Elimino CV");
        this.ofertaService.cambiarEstadoOferta(this.id!, nuevoEstado).subscribe({
          next: () => {
            this.estadoActual = this.estadosDisponibles.find(e => e.codigo === nuevoEstado);
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "El estado de la oferta se actualizó correctamente",
              timer: 3000,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error al actualizar estado de oferta', error);
            if(error.error.message === "Un error inesperado ha ocurrido: La oferta ya está FINALIZADA y no puede cambiar de estado.") {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "La oferta ya finalizó, no puede cambiar su estado",
                timer: 3000,
                showConfirmButton: false,
              });
              
          }
        },
        });
      }
    });
  }

  volverAListado() {
    this.router.navigate([`visualizar-ofertas`]);
  }
}