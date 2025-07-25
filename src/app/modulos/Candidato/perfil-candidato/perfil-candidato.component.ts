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
  candidato: Candidato = {
    estadoBusqueda: {
      nombreEstadoBusqueda: 'Buscando activamente'
    } 
  };

  paises: Pais[] =[];
  provincias: Provincia[] = [];
  generos: Genero[] = [];

  constructor(
    private paisService: PaisService,
    private provinciaService: ProvinciaService,
    private generoService: GeneroService,
  ) {}

  ngOnInit(): void {
    this.paisService.findAllActivos().subscribe({
      next: (data) => {
        this.paises = data;
        console.log(this.paises)
      },
      error: (error) => {
        console.error('Error al obtener paises', error);
      }
    })

    this.provinciaService.findAllActivas().subscribe({
      next: (data) => {
        this.provincias = data;
        console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener provincias', error);
      }
    })
    
    this.generoService.findAllActivos().subscribe({
      next: (data) => {
        this.generos = data;
        console.log(this.generos)
      },
      error: (error) => {
        console.error('Error al obtener generos', error);
      }
    })
  }

  modificarCandidato() {
    this.modoEdicion = true;
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


}
