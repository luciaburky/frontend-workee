import { Component } from '@angular/core';
import { Modalidad } from '../modalidad';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { RecargarService } from '../../recargar.service';
import { ModalidadService } from '../modalidad.service';
import { CrearModalidadComponent } from '../crear-modalidad/crear-modalidad.component';
import { ModificarModalidadComponent } from '../modificar-modalidad/modificar-modalidad.component';

@Component({
  selector: 'app-listado-modalidad',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-modalidades.component.html',
  styleUrl: './listado-modalidades.component.css'
})
export class ListadoModalidadesComponent {
  modalidadList: Modalidad[] = [];
  modalRef?: NgbModalRef;
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private modalidadService: ModalidadService,
    private modalService: ModalService,
    private recargarService: RecargarService,
  ) {}

  ngOnInit(): void {    
    this.modalidadService.findAll().subscribe(modalidades => {
      this.modalidadList = modalidades;
    });


    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    })
  }

  // Creacion de Modalidad
  crearModalidad() {
    this.modalRef = this.modalService.open(CrearModalidadComponent, {
      centered: true,
    });
  }
  
  // Modificacion de Modalidad
  modificarModalidad(idModalidad: number) {
    this.modalidadService.setId(idModalidad);
    this.modalRef = this.modalService.open(ModificarModalidadComponent, {
      centered: true,
    });
  }
  
  // Habilitacion de Modalidad
  habilitarModalidad(idModalidad: number) {
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
        this.modalidadService.habilitar(idModalidad).subscribe({
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
            title: "Modalidad habilitada correctamente",
          });
          }
        })
    } else {

    }});
  }
  
  // Deshabilitacion de Modalidad
  deshabilitarModalidad(idModalidad: number) {
     Swal.fire({
      text: "¿Desea habilitar el parámetro?",
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
        this.modalidadService.deshabilitar(idModalidad).subscribe({
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
            title: "Modalidad deshabilitada correctamente",
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
                title: "La modalidad ya se encuentra deshabilitada",
              });
            }
          }
        })
    } else {

    }});
  }

  recargar(): void {
    this.modalidadService.findAll().subscribe(modalidades => {
      this.modalidadList = modalidades;
    });
  }

    // Para paginacion
    get totalPaginas(): number {
      return Math.ceil(this.modalidadList.length / this.elementosPorPagina);
    }
  
    get paginas(): number[] {
      return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    }
  
    obtenerModalidadesPaginadas(): Modalidad[] {
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
      const fin = inicio + this.elementosPorPagina;
      return this.modalidadList.slice(inicio, fin);
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
