import { Component } from '@angular/core';
import { Rubro } from '../rubro';
import { RubroService } from '../rubro.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from 'express';
import Swal from 'sweetalert2';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { RecargarService } from '../../recargar.service';
import { CrearRubroComponent } from '../crear-rubro/crear-rubro.component';
import { ModificarRubroComponent } from '../modificar-rubro/modificar-rubro.component';

@Component({
  standalone: true,
  selector: 'app-listado-rubros',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-rubros.component.html',
  styleUrl: './listado-rubros.component.css'
})
export class ListadoRubrosComponent {
  rubroList: Rubro[] = []; // lista de rubros filtrada segun la busqueda
  rubroListOriginal: Rubro[] = []; // lista de rubros completa, sin filtrar
  modalRef?: NgbModalRef;
  filtro: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private rubroService: RubroService,
    private modalService: ModalService,
    private recargarService: RecargarService
  ) {  }

  ngOnInit(): void {
    this.rubroService.findAll().subscribe(rubros => {
      this.rubroListOriginal = rubros;
      this.rubroList = [...rubros];
    });

    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    })
  }

  // Creacion de Rubro
  crearRubro() {
    this.modalRef = this.modalService.open(CrearRubroComponent, {
      centered: true,
    });
  }
  
  // Modificacion de Rubro
  modificarRubro(idRubro: number) {
    this.rubroService.setId(idRubro);
    this.modalRef = this.modalService.open(ModificarRubroComponent, {
      centered: true,
    });
  }
  
  // Habilitacion de Rubro
  habilitarRubro(idRubro: number) {
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
            this.rubroService.habilitar(idRubro).subscribe({
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
                title: "Rubro habilitado correctamente",
              });
              }
            })
        } else {

        }});
      }
    
  // Deshabilitacion de Rubro
  deshabilitarRubro(idRubro: number) {
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
        this.rubroService.deshabilitar(idRubro).subscribe({
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
            title: "Rubro deshabilitado correctamente",
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
                title: "Este rubro ya se encuentra deshabilitado",
              });
            }
          }
        })
    } else {

    }});
  }

  // Buscar rubros dentro del listado
  buscarRubros() {
    const texto = this.filtro.trim().toLowerCase();

    if (texto === '') {
      this.rubroList = [... this.rubroListOriginal ];
      return;
    }

    this.rubroList = this.rubroListOriginal.filter(rubro =>
      rubro.nombreRubro?.toLowerCase().includes(texto)
    );
  }

  // Para recargar la pagina
  recargar(): void {
    this.rubroService.findAll().subscribe(rubros => {
      this.rubroListOriginal = rubros;
      this.buscarRubros();
    });
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.rubroList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerRubrosPaginados(): Rubro[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.rubroList.slice(inicio, fin);
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
