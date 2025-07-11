import { Component, OnInit } from '@angular/core';
import { Pais } from '../pais';
import { PaisService } from '../pais.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CrearPaisComponent } from '../crear-pais/crear-pais.component';
import { ModalService } from '../../../compartidos/modal/modal.service';
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModificarPaisComponent } from '../modificar-pais/modificar-pais.component';

@Component({
  standalone: true,
  selector: 'app-listado-paises',
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-paises.component.html',
  styleUrls: ['./listado-paises.component.css']
})
export class ListadoPaisesComponent implements OnInit{
  paisList: Pais[] = []; // lista de paises filtrada segun la busqueda
  paisListOriginal: Pais[] = []; // lista de paises completa, sin filtrar
  // nuevoPais: Pais;
  modalRef?: NgbModalRef;
  filtro: string = '';


  constructor(
    private paisService: PaisService,
    private router: Router,
    private modalService: ModalService,
  ) {  }

  ngOnInit(): void {
    this.paisService.findAll().subscribe(paises => {
      this.paisListOriginal = paises;
      this.paisList = [...paises];
    });
  }

  // Creacion de pais
  crearPais() {
    this.modalRef = this.modalService.open(CrearPaisComponent, {
      centered: true,
    });
  }
  
  // Modificacion de pais
  modificarPais() {}
  
  // Habilitacion de pais
  habilitarPais() {
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
        
    } else {

    }});
  }
  
  // Deshabilitacion de pais
  deshabilitarPais() {
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

}
