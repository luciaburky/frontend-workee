import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearTipoHabilidadComponent } from '../crear-tipo-habilidad/crear-tipo-habilidad.component';
import { ModificarTipoHabilidadComponent } from '../modificar-tipo-habilidad/modificar-tipo-habilidad.component';
import { TipoHabilidad } from '../tipo-habilidad';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { RecargarService } from '../../recargar.service';
import { TipoHabilidadService } from '../tipo-habilidad.service';

@Component({
  selector: 'app-listado-tipos-habilidad',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-tipos-habilidad.component.html',
  styleUrl: './listado-tipos-habilidad.component.css'
})
export class ListadoTiposHabilidadComponent {
  tipoList: TipoHabilidad[] = [];
  modalRef?: NgbModalRef;
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private tipoHabilidadService: TipoHabilidadService,
    private modalService: ModalService,
    private recargarService: RecargarService,
  ) {}

  ngOnInit(): void {    
    this.tipoHabilidadService.findAll().subscribe(tipos => {
      this.tipoList = tipos;
    });


    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    })
  }

  // Creacion de TipoHabilidad
  crearTipoHabilidad() {
    this.modalRef = this.modalService.open(CrearTipoHabilidadComponent, {
      centered: true,
    });
  }
  
  // Modificacion de TipoHabilidad
  modificarTipoHabilidad(idTipoHabilidad: number) {
    this.tipoHabilidadService.setId(idTipoHabilidad);
    this.modalRef = this.modalService.open(ModificarTipoHabilidadComponent, {
      centered: true,
    });
  }
  
  // Habilitacion de TipoHabilidad
  habilitarTipoHabilidad(idTipoHabilidad: number) {
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
        this.tipoHabilidadService.habilitar(idTipoHabilidad).subscribe({
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
            title: "Tipo de habilidad habilitado correctamente",
          });
          }
        })
    } else {

    }});
  }
  
  // Deshabilitacion de idTipoHabilidad
  deshabilitarTipoHabilidad(idTipoHabilidad: number) {
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
        this.tipoHabilidadService.deshabilitar(idTipoHabilidad).subscribe({
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
            title: "Tipo de habilidad deshabilitado correctamente",
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
                title: "El tipo de habilidad ya se encuentra deshabilitado",
              });
            }
          }
        })
    } else {

    }});
  }

  recargar(): void {
    this.tipoHabilidadService.findAll().subscribe(tipos => {
      this.tipoList = tipos;
    });
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.tipoList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerTiposPaginados(): TipoHabilidad[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.tipoList.slice(inicio, fin);
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