import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OfertaService } from '../../../oferta/oferta.service';
import { Oferta } from '../../../oferta/oferta';
import { EstadoOfertaService } from './../../../../admin/ABMEstadoOferta/estado-oferta.service';
import { EstadoOferta } from './../../../../admin/ABMEstadoOferta/estado-oferta';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

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

 cambiarEstadoOferta(codigoNuevoEstado: string) {
  let configSwal: any;

  if (codigoNuevoEstado === "CERRADA") {
    configSwal = {
      title: "¿Está seguro de que desea cerrar la oferta?",
      text: "No podrá recibir más postulaciones",
      icon: "info",
      iconColor: "#31A5DD",
      showCancelButton: true,
      confirmButtonColor: "#31A5DD",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "No, volver",
      reverseButtons: true,
    };
  } else if (codigoNuevoEstado === "FINALIZADA") {
    configSwal = {
      title: "¿Está seguro de que desea finalizar la oferta?",
      text: "Se finalizará el proceso de selección.\nLos candidatos restantes serán notificados",
      icon: "warning",
      iconColor: "#31A5DD",
      showCancelButton: true,
      confirmButtonColor: "#31A5DD",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, finalizar",
      cancelButtonText: "No, volver",
      reverseButtons: true,
    };
  } else if (codigoNuevoEstado === "ABIERTA") {
    // ⭐ Nuevo Swal específico para reabrir
    configSwal = {
      title: "¿Está seguro de que desea reabrir la oferta?",
      text: "La oferta volverá a estar disponible y podrá recibir postulaciones.",
      icon: "question",
      iconColor: "#31A5DD",
      showCancelButton: true,
      confirmButtonColor: "#31A5DD",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, reabrir",
      cancelButtonText: "No, volver",
      reverseButtons: true,
    };
  } else {
    // fallback genérico
    configSwal = {
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
    };
  }

  Swal.fire(configSwal).then((result) => {
    if (result.isConfirmed) {
      this.ofertaService.cambiarEstadoOferta(this.id!, codigoNuevoEstado).subscribe({
        next: () => {
          this.estadoActual = this.estadosDisponibles.find(e => e.codigo === codigoNuevoEstado);
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
          if (error.error.message?.includes("La oferta ya está FINALIZADA")) {
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

  isDropdownOpen: boolean = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectEstado(estado: EstadoOferta) {
    //this.estadoActual = estado;
    // Aquí podrías llamar a tu función existente para cambiar el estado, por ejemplo:
    // this.cambiarEstadoOferta({ target: { value: estado.codigo } });
    this.cambiarEstadoOferta(estado.codigo);
    this.isDropdownOpen = false; // Cierra el menú después de seleccionar
  }

}