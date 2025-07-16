import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstadoBusquedaLaboral } from '../estado-busqueda-laboral';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EstadoBusquedaLaboralService } from '../estado-busqueda-laboral.service';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { RecargarService } from '../../recargar.service';
import { CrearEstadoBusquedaLaboralComponent } from '../crear-estado-busqueda-laboral/crear-estado-busqueda-laboral.component';
import { ModificarEstadoBusquedaLaboralComponent } from '../modificar-estado-busqueda-laboral/modificar-estado-busqueda-laboral.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-estados-busqueda-laboral',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-estados-busqueda-laboral.component.html',
  styleUrl: './listado-estados-busqueda-laboral.component.css'
})
export class ListadoEstadosBusquedaLaboralComponent {
  estadoList: EstadoBusquedaLaboral[] = [];
  modalRef?: NgbModalRef;
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private estadoService: EstadoBusquedaLaboralService,
    private modalService: ModalService,
    private recargarService: RecargarService,
  ) {}

  ngOnInit(): void {    
    this.estadoService.findAll().subscribe(estados => {
      this.estadoList = estados;
    });

    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    })
  }

  // Creacion de EstadoBusquedaLaboral
  crearEstado() {
    this.modalRef = this.modalService.open(CrearEstadoBusquedaLaboralComponent, {
      centered: true,
    });
  }
  
  // Modificacion de EstadoBusquedaLaboral
  modificarEstado(idEstado: number) {
    this.estadoService.setId(idEstado);
    this.modalRef = this.modalService.open(ModificarEstadoBusquedaLaboralComponent, {
      centered: true,
    });
  }
  
  // Habilitacion de EstadoBusquedaLaboral
  habilitarEstado(idEstado: number) {
    Swal.fire({
      text: "¿Desea habilitar el parámetro?",
      icon: "success",
      iconColor: "#70DC73",
      showCancelButton: true,
      confirmButtonColor: "#70DC73",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, habilitar",
      cancelButtonText: "Volver",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.estadoService.habilitar(idEstado).subscribe({
          next: (response) => {
          this.recargar();
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Estado de búsqueda laboral habilitado correctamente",
          });
          }
        })
    } else {

    }});
  }
  
  // Deshabilitacion de EstadoBusquedaLaboral
  deshabilitarEstado(idEstado: number) {
      Swal.fire({
      text: "¿Desea deshabilitar el parámetro?",
      icon: "error",
      iconColor: "#FF5252",
      showCancelButton: true,
      confirmButtonColor: "#FF5252",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Volver",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.estadoService.deshabilitar(idEstado).subscribe({
          next: (response) => {
            this.recargar();
            const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Estado de búsqueda laboral deshabilitado correctamente",
          });
          },
          error: (error) => {
            if(error.error.message === "La entidad ya se encuentra deshabilitada") {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "warning",
                title: "El estado de búsqueda laboral ya se encuentra deshabilitado",
              });
            }
          }
        })
    } else {

    }});
  }

  recargar(): void {
    this.estadoService.findAll().subscribe(estados => {
      this.estadoList = estados;
    });
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.estadoList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerEstadosPaginados(): EstadoBusquedaLaboral[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.estadoList.slice(inicio, fin);
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
