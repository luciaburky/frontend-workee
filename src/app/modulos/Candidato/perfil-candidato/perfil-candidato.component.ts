import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PaisService } from '../../../admin/ABMPais/pais.service';
import { ProvinciaService } from '../../../admin/ABMProvincia/provincia.service';
import { GeneroService } from '../../../admin/ABMGenero/genero.service';
import { Genero } from '../../../admin/ABMGenero/genero';
import { Pais } from '../../../admin/ABMPais/pais';
import { Provincia } from '../../../admin/ABMProvincia/provincia';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Candidato } from '../candidato';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SeleccionHabilidadesComponent } from './seleccion-habilidades/seleccion-habilidades.component';
import { ActivatedRoute } from '@angular/router';
import { CandidatoService } from '../candidato.service';
import { Habilidad } from '../../../admin/ABMHabilidad/habilidad';
import { CandidatoHabilidad } from '../candidato-habilidad';

@Component({
  selector: 'app-perfil-candidato',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil-candidato.component.html',
  styleUrls: ['./perfil-candidato.component.css'],
})
export class PerfilCandidatoComponent implements OnInit {
  
  modoEdicion: boolean = false;
  verContrasenia: boolean = false;
  mostrarCampoRepetir: boolean = true;
  repetirContrasenia = '';
  candidato: Candidato = {};
  modalRef?: NgbModalRef;

  paises: Pais[] =[];
  provincias: Provincia[] = [];
  provinciasDePais: Provincia[] = []; // se usa para mostrar las provincias segun el pais que se selecciono
  generos: Genero[] = [];
  habilidades: CandidatoHabilidad[] = [];
  paisSeleccionado?: Pais;

  constructor(
    private candidatoService: CandidatoService,
    private paisService: PaisService,
    private provinciaService: ProvinciaService,
    private generoService: GeneroService,
    private modalService: ModalService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idCandidato'));
    this.candidatoService.findById(id).subscribe({
      next: (data) => {
        this.candidato = data;
        this.paisSeleccionado = this.candidato.provincia?.pais;
        this.filtrarProvinciasPorPais(this.candidato.provincia?.pais || null);
      },
      error: (error) => {
        console.error('Error al obtener el candidato', error);
      }
    });
    
    this.paisService.findAllActivos().subscribe({
      next: (data) => {
        this.paises = data;
        // console.log(this.paises)
      },
      error: (error) => {
        console.error('Error al obtener paises', error);
      }
    })
    
    this.provinciaService.findAllActivas().subscribe({
      next: (data) => {
        this.provincias = data;
        // console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener provincias', error);
      }
    })
    
    this.generoService.findAllActivos().subscribe({
      next: (data) => {
        this.generos = data;
        //console.log(this.generos)
      },
      error: (error) => {
        console.error('Error al obtener generos', error);
      }
    })
    
    this.habilidades = this.candidato.habilidades ?? [];
    // console.log("habilidades: ", this.habilidades)
  }

  modificarCandidato() {
    this.modoEdicion = true;
  }

  seleccionarHabilidades() {
    this.modalRef = this.modalService.open(SeleccionHabilidadesComponent, {
      centered: true,
      scrollable: true,
      size: 'lg'
    });

    this.modalRef.componentInstance.habilidadesSeleccionadas = [...this.habilidades];

    // PARA RECIBIR LAS HABILIDADES ACA Y ENVIARLAS EN LA REQUEST
    // this.modalRef.result.then(
    //   (habilidadesSeleccionadas) => {

    //   }
    // )
  }

  volver() {
    if (this.modoEdicion) {
      Swal.fire({
        title: "¿Está seguro de que desea volver?",
        text: "Los cambios realizados no se guardarán",
        icon: "question",
        iconColor: "#31A5DD",
        showCancelButton: true,
        confirmButtonColor: "#31A5DD",
        cancelButtonColor: "#697077",
        confirmButtonText: "Sí, volver",
        cancelButtonText: "No, cerrar",
        reverseButtons: true,
        customClass: {
          title: 'titulo-chico',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.modoEdicion = false;
      }});
    }
  }

  enviarDatos() {
    // segun el chat, tengo que setear el pais en la provincia, si fue cambiado
    // if (this.candidato.provincia) {
    //   this.candidato.provincia.pais = this.paisSeleccionado;
    // }
  }

  compararGenero = (g1: Genero, g2: Genero) => g1 && g2 ? g1.id === g2.id : g1 === g2;
  
  compararPais = (p1: Pais, p2: Pais) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  
  compararProvincia = (p1: Provincia, p2: Provincia) => p1 && p2 ? p1.id === p2.id : p1 === p2;

  formatearFecha(fechaStr: string | undefined): string {
    if (!fechaStr) return '';

    const [anio, mes, dia] = fechaStr.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  filtrarProvinciasPorPais(paisSeleccionado: Pais | null) {
    if (!paisSeleccionado) {
      this.provinciasDePais = [];
      this.candidato.provincia = undefined; // limpiar si no hay país seleccionado
      return;
    }

    this.provinciasDePais = this.provincias.filter(
      provincia => provincia.pais?.id === paisSeleccionado.id
    );

    this.paisSeleccionado = paisSeleccionado;

    if (!this.provinciasDePais.some(p => p.id === this.candidato.provincia?.id)) {
      this.candidato.provincia = undefined;
    }
  }

}
