import { Component, OnInit } from '@angular/core';
import { Pais } from '../pais';
import { PaisService } from '../pais.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CrearPaisComponent } from '../crear-pais/crear-pais.component';
import { ModalService } from '../../../compartidos/modal/modal.service';
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModificarPaisComponent } from '../modificar-pais/modificar-pais.component';
import { RecargarService } from '../../recargar.service';

@Component({
  standalone: true,
  selector: 'app-listado-paises',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-paises.component.html',
  styleUrls: ['./listado-paises.component.css']
})
export class ListadoPaisesComponent implements OnInit{
  paisList: Pais[] = []; // lista de paises filtrada segun la busqueda
  paisListOriginal: Pais[] = []; // lista de paises completa, sin filtrar
  // nuevoPais: Pais;
  modalRef?: NgbModalRef;
  filtro: string = '';
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private paisService: PaisService,
    private router: Router,
    private modalService: ModalService,
    private recargarService: RecargarService
  ) {  }

  ngOnInit(): void {
    this.paisService.findAll().subscribe(paises => {
      this.paisListOriginal = paises;
      this.paisList = [...paises];
    });

    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    })
  }

  // Creacion de pais
  crearPais() {
    this.modalRef = this.modalService.open(CrearPaisComponent, {
      centered: true,
    });
  }
  
  // Modificacion de pais
  modificarPais(idPais: number) {
    this.paisService.setId(idPais);
    this.modalRef = this.modalService.open(ModificarPaisComponent, {
      centered: true,
    });
  }
  
  // Habilitacion de pais
  habilitarPais(idPais: number) {
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
            this.paisService.habilitar(idPais).subscribe({
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
                title: "País habilitado correctamente",
              });
              }
            })
        } else {

        }});
      }
    
  // Deshabilitacion de pais
  deshabilitarPais(idPais: number) {
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
        this.paisService.deshabilitar(idPais).subscribe({
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
            title: "País deshabilitado correctamente",
          });
          },
          error: (error) => {
            if(error.error.message === "Un error inesperado ha ocurrido: El país ya está deshabilitado") {
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
                title: "Este país ya se encuentra deshabilitado",
              });
            }
          }
        })
    } else {

    }});
  }

  // Ver provincias asociadas
  verProvincias(idPais: number): void {
    this.router.navigate([`/provincias`, idPais])
  }

  // Buscar paises dentro del listado
  buscarPaises() {
    const texto = this.filtro.trim().toLowerCase();

    if (texto === '') {
      this.paisList = [... this.paisListOriginal ];
      return;
    }

    this.paisList = this.paisListOriginal.filter(pais =>
      pais.nombrePais?.toLowerCase().includes(texto)
    );
  }

  // Para recargar la pagina
  recargar(): void {
    this.paisService.findAll().subscribe(paises => {
      this.paisListOriginal = paises;
      this.buscarPaises();
    });
  }

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.paisList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerPaisesPaginados(): Pais[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.paisList.slice(inicio, fin);
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
