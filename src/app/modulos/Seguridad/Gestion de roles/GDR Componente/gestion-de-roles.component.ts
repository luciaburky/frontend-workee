// import { CommonModule } from "@angular/common";
// import { Component } from "@angular/core";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { Rol } from "../../rol";
// import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
// import { RolService } from "../../usuarios/rol.service";
// import { ModalService } from "../../../../compartidos/modal/modal.service";
// import { RecargarService } from "../../../../admin/recargar.service";
// import { CrearRolComponent } from "../Crear Rol/crear-rol.component";
// import { ModificarRolComponent } from "../Modificar Rol/modificar-rol.component";

// @Component({
//   selector: 'app-listado-estados-busqueda-laboral',
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './gestion-de-roles.component.html',
//   styleUrl: './gestion-de-roles.component.css'
// })
// export class ListadoEstadosBusquedaLaboralComponent {

//   rolList: Rol[] = [];
//   modalRef?: NgbModalRef;
//   paginaActual: number = 1;
//   elementosPorPagina: number = 10;

//   constructor(
//     private rolService: RolService,
//     private modalService: ModalService,
//     private recargarService: RecargarService,
//   ) {}

//     ngOnInit(): void {    
//         this.rolService.findAll().subscribe(roles => {
//         this.rolList = roles;
//         });

//         this.recargar();
//         this.recargarService.recargar$.subscribe(() => {
//         this.recargar();
//         })
//     }

//     recargar(): void {
//     this.rolService.findAll().subscribe(roles => {
//       this.rolList = roles;
//     });
//   }

//   crearRol(){
//     this.modalRef = this.modalService.open(CrearRolComponent,{
//       centered: true,
//     });
//   }

//   modificarRol(id: number) {
//     //this.rolService.setId(id);
//     this.modalRef = this.modalService.open(ModificarRolComponent, {
//       centered: true,
//     });
//   }

//   bajarol(){

//   }

//   habilitarRol(){

//   }

//   deshabilitarRol(){

//   }


//   // Para paginacion
//   get totalPaginas(): number {
//     return Math.ceil(this.rolList.length / this.elementosPorPagina);
//   }

//   get paginas(): number[] {
//     return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
//   }

//   obtenerRolesPaginados(): Rol[] {
//     const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
//     const fin = inicio + this.elementosPorPagina;
//     return this.rolList.slice(inicio, fin);
//   }

//   avanzarPagina(): void {
//     if (this.paginaActual < this.totalPaginas) {
//       this.paginaActual++;
//     }
//   }
  
//   retrocederPagina(): void {
//     if (this.paginaActual > 1) {
//       this.paginaActual--;
//     }
//   }

//   irAPagina(pagina: number): void {
//     if (pagina >= 1 && pagina <= this.totalPaginas) {
//       this.paginaActual = pagina;
//     }
//   }
// }


import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Rol } from "../../rol";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { RolService } from "../../usuarios/rol.service";
import { ModalService } from "../../../../compartidos/modal/modal.service";
import { RecargarService } from "../../../../admin/recargar.service";
import { CrearRolComponent } from "../Crear Rol/crear-rol.component";
import { ModificarRolComponent } from "../Modificar Rol/modificar-rol.component";

@Component({
  selector: 'app-listado-estados-busqueda-laboral', // puedes renombrar más adelante
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-de-roles.component.html',
  styleUrl: './gestion-de-roles.component.css'
})
export class GestionderolesComponent {

  rolList: Rol[] = [];
  modalRef?: NgbModalRef;
  paginaActual = 1;
  elementosPorPagina = 10;
  permisosAsignados!:number 

  constructor(
    private rolService: RolService,
    private modalService: ModalService,
    private recargarService: RecargarService,
  ) {}

  ngOnInit(): void {

    

    this.rolService.findAll().subscribe(roles => {
      this.rolList = roles;
    });

    this.recargar();
    this.recargarService.recargar$.subscribe(() => {
      this.recargar();
    });
  }

  recargar(): void {
    this.rolService.findAll().subscribe(roles => {
      this.rolList = roles;
    });
  }

  crearRol(): void {
    this.modalRef = this.modalService.open(CrearRolComponent, { centered: true });
  }

  modificarRol(id: number): void {
    // this.rolService.setId(id);
    this.modalRef = this.modalService.open(ModificarRolComponent, { centered: true });
  }

  // --- ACCIONES DE ESTADO (firmas corregidas para evitar el error 2554) ---
  habilitarRol(id: number): void {
  }

  deshabilitarRol(id: number): void {
  }

  // --- Paginación ---
  get totalPaginas(): number {
    return Math.ceil(this.rolList.length / this.elementosPorPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerRolesPaginados(): Rol[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.rolList.slice(inicio, fin);
  }

  avanzarPagina(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  retrocederPagina(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }
}
