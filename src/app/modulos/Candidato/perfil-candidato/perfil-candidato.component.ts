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
import { HabilidadService } from '../../../admin/ABMHabilidad/habilidad.service';
import { EstadoBusquedaLaboralService } from '../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral.service';
import { EstadoBusquedaLaboral } from '../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral';

@Component({
  selector: 'app-perfil-candidato',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil-candidato.component.html',
  styleUrls: ['./perfil-candidato.component.css'],
})
export class PerfilCandidatoComponent implements OnInit {
  
  modoEdicion: boolean = false;
  verContrasenia: boolean = false;
  mostrarCampoRepetir: boolean = false;
  repetirContrasenia = '';
  candidato: Candidato = {};
  candidatoOriginal: Candidato = {
    id: 0,
    nombreCandidato: '',
    apellidoCandidato: '',
    fechaDeNacimiento: '',
    estadoBusqueda: {
      id: 0,
      nombreEstadoBusqueda: ''
    },
    cv: {
      id: 0,
      enlaceCV: '',
    },
    genero: {
      id: 0,
      nombreGenero: ''
    },
    provincia: {
      id: 0,
      nombreProvincia: ''
    },
    usuario: {
      id: 0,
      correoUsuario: '',
      contraseniaUsuario: '',
      urlFotoUsuario: '',
    }
  }
  modalRef?: NgbModalRef;

  paises: Pais[] =[];
  provincias: Provincia[] = [];
  provinciasDePais: Provincia[] = []; // se usa para mostrar las provincias segun el pais que se selecciono
  generos: Genero[] = [];
  estados: EstadoBusquedaLaboral[] = [];
  habilidades: CandidatoHabilidad[] = [];
  paisSeleccionado?: Pais;
  todasHabilidades: Habilidad[] = []; // todas las habilidades de la BD

  habilidadesSeleccionadasID: number[] = []; // array de ids de las habildiades que le quedaron al candidato
  habilidadesFinales: any;

  constructor(
    private candidatoService: CandidatoService,
    private paisService: PaisService,
    private provinciaService: ProvinciaService,
    private generoService: GeneroService,
    private estadoBusquedaService: EstadoBusquedaLaboralService,
    private habilidadService: HabilidadService,
    private modalService: ModalService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    
    const id = Number(this.route.snapshot.paramMap.get('idCandidato'));
    
    this.provinciaService.findAllActivas().subscribe({
      next: (data) => {
        this.provincias = data;
        
        this.candidatoService.findById(id).subscribe({
          next: (data) => {
            this.candidato = data;
            this.candidatoOriginal = JSON.parse(JSON.stringify(data));
            this.paisSeleccionado = this.candidato.provincia?.pais;
            this.filtrarProvinciasPorPais(this.paisSeleccionado || null);
          },
          error: (error) => {
            console.error('Error al obtener el candidato', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener provincias', error);
      }
    })
    
    this.paisService.findAllActivos().subscribe({
      next: (data) => {
        this.paises = data;
        // console.log(this.paises)
      },
      error: (error) => {
        console.error('Error al obtener paises', error);
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
    
    this.estadoBusquedaService.findAllActivos().subscribe({
      next: (data) => {
        this.estados = data;
        //console.log(this.generos)
      },
      error: (error) => {
        console.error('Error al obtener estados', error);
      }
    })
      
    this.habilidadService.findAllActivas().subscribe(habilidades => {
      this.todasHabilidades = habilidades;
    });

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
    this.modalRef.result.then(
      (result) => {
        if (result) {
          this.habilidadesSeleccionadasID = result;

          const habilidadesFinales: CandidatoHabilidad[] = result.map((id: number | undefined) => {
            const habilidadEncontrada = this.todasHabilidades.find(h => h.id === id);
            return {
              habilidad: habilidadEncontrada
            } as CandidatoHabilidad;
          }).filter((ch: { habilidad: undefined; }) => ch.habilidad !== undefined);

          this.habilidades = habilidadesFinales;
        }
      }
    )
    console.log("estoy desde el perfil del candidato, las habilidades son: ", this.habilidadesSeleccionadasID)
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
          this.candidato = JSON.parse(JSON.stringify(this.candidatoOriginal));
      }});
    }
  }

  enviarDatos() {
    Swal.fire({
      title: '¿Desea confirmar los cambios realizados?',
      icon: "question",
      iconColor: "#70DC73",
      showCancelButton: true,
      confirmButtonColor: "#70DC73",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, volver",
      reverseButtons: true,
      customClass: {
        title: 'titulo-chico',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let habilidadesAEnviar: number[] = [];
        console.log("habilidades que ya tiene: ", this.candidato.habilidades?.map(habilidad => habilidad.habilidad?.id) || [])
        if (this.habilidadesSeleccionadasID.length === 0) {
          habilidadesAEnviar = this.candidato.habilidades?.map(habilidad => habilidad.habilidad?.id) || [];
        } else {
          habilidadesAEnviar = this.habilidadesSeleccionadasID;
        }
        const contrasenia = this.candidato.usuario?.contraseniaUsuario ?? '';
        const repetirContrasenia = this.repetirContrasenia ?? '';
        this.candidatoService.modificarCandidato(this.candidato.id!,
                                                this.candidato.nombreCandidato ?? '',
                                                this.candidato.apellidoCandidato ?? '',
                                                this.candidato.provincia?.id ?? 0,
                                                this.candidato.estadoBusqueda?.id ?? 0,
                                                this.candidato.genero?.id ?? 0,
                                                habilidadesAEnviar,
                                                contrasenia,
                                                repetirContrasenia
        ).subscribe({
          next: () => {
            this.candidatoOriginal = JSON.parse(JSON.stringify(this.candidato));
            this.modoEdicion = false;
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "El perfil se modificó correctamente",
              timer: 3000,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error al modificar candidato', error);
            if(error.error.message === "Las contraseñas deben coincidir") {
              Swal.fire({
                toast: true,
                icon: 'warning',
                title: 'Las contraseñas no coinciden',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
              });
            }
            if(error.error.message === "La contraseña debe tener al menos 8 caracteres") {
              Swal.fire({
                toast: true,
                icon: 'warning',
                title: 'La contraseña debe tener al menos 8 caracteres',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
              });
          }
        }
      })
    }});
  }

  compararGenero = (g1: Genero, g2: Genero) => g1 && g2 ? g1.id === g2.id : g1 === g2;
  
  compararPais = (p1: Pais, p2: Pais) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  
  compararProvincia = (p1: Provincia, p2: Provincia) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  
  compararEstadoBusqueda = (e1: EstadoBusquedaLaboral, e2: EstadoBusquedaLaboral) => e1 && e2 ? e1.id === e2.id : e1 === e2;

  formatearFecha(fechaStr: string | undefined): string {
    if (!fechaStr) return '';

    const [anio, mes, dia] = fechaStr.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  filtrarProvinciasPorPais(paisSeleccionado: Pais | null) {
    this.paisSeleccionado = paisSeleccionado!;
    
    if (!paisSeleccionado) {
      this.provinciasDePais = [];
      this.candidato.provincia = undefined; // limpiar si no hay país seleccionado
      return;
    }

    this.provinciasDePais = this.provincias.filter(
      provincia => provincia.pais?.id === paisSeleccionado.id
    );

    const provinciaValida = this.provinciasDePais.find(p => p.id === this.candidato.provincia?.id);
    if (!provinciaValida) {
      this.candidato.provincia = undefined;
    }
  }

  get habilidadesParaMostrar(): CandidatoHabilidad[] {
    // console.log(this.habilidadesFinales);
    return this.habilidadesFinales === undefined ? this.habilidades : this.habilidadesFinales;
  }

  editarCV() {
    console.log("Editar CV");
  }

  eliminarCV() {
    console.log("Eliminar CV");
  }
}
