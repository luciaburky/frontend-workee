import { Component } from '@angular/core';
import { Habilidad } from '../habilidad';
import { CrearHabilidadComponent } from '../crear-habilidad/crear-habilidad.component';
import { ModificarHabilidadComponent } from '../modificar-habilidad/modificar-habilidad.component';
import Swal from 'sweetalert2';
import { HabilidadService } from '../habilidad.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { RecargarService } from '../../recargar.service';

@Component({
  selector: 'app-listado-habilidades',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-habilidades.component.html',
  styleUrl: './listado-habilidades.component.css'
})
export class ListadoHabilidadesComponent {
  habilidadList: Habilidad[] = []; // lista de habilidades filtrada segun la busqueda
  habilidadListOriginal: Habilidad[] = []; // lista de habilidades completa, sin filtrar
  modalRef?: NgbModalRef;
  filtro: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private habilidadService: HabilidadService,
    private modalService: ModalService,
    private recargarService: RecargarService
  ) {  }

  ngOnInit(): void {
    this.habilidadService.findAll().subscribe(habilidades => {
      this.habilidadListOriginal = habilidades;
      this.habilidadList = [...habilidades];
    });

    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    })
  }

  // Creacion de Habilidad
  crearHabilidad() {
    this.modalRef = this.modalService.open(CrearHabilidadComponent, {
      centered: true,
    });
  }
  
  // Modificacion de Habilidad
  modificarHabilidad(idHabilidad: number) {
    this.habilidadService.setId(idHabilidad);
    this.modalRef = this.modalService.open(ModificarHabilidadComponent, {
      centered: true,
    });
  }
  
  // Habilitacion de Habilidad
  habilitarHabilidad(idHabilidad: number) {
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
            this.habilidadService.habilitar(idHabilidad).subscribe({
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
                title: "Habilidad habilitada correctamente",
              });
              }
            })
        } else {

        }});
      }
    
  // Deshabilitacion de Habilidad
  deshabilitarHabilidad(idHabilidad: number) {
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
        this.habilidadService.deshabilitar(idHabilidad).subscribe({
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
            title: "Habilidad deshabilitada correctamente",
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
                title: "Este habilidad ya se encuentra deshabilitado",
              });
            }
          }
        })
    } else {

    }});
  }

  // Buscar habilidades dentro del listado
  buscarHabilidades() {
    const texto = this.filtro.trim().toLowerCase();

    if (texto === '') {
      this.habilidadList = [... this.habilidadListOriginal ];
      return;
    }

    this.habilidadList = this.habilidadListOriginal.filter(habilidad =>
      habilidad.nombreHabilidad?.toLowerCase().includes(texto)
    );
  }

  // Para recargar la pagina
  recargar(): void {
    this.habilidadService.findAll().subscribe(habilidades => {
      this.habilidadListOriginal = habilidades;
      this.buscarHabilidades();
    });
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.habilidadList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerHabilidadesPaginados(): Habilidad[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.habilidadList.slice(inicio, fin);
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
