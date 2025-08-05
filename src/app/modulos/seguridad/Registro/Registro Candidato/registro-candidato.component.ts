import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Pais } from '../../../../admin/ABMPais/pais';
import { Provincia } from '../../../../admin/ABMProvincia/provincia';
import { PaisService } from '../../../../admin/ABMPais/pais.service';
import { ProvinciaService } from '../../../../admin/ABMProvincia/provincia.service';
import { GeneroService } from '../../../../admin/ABMGenero/genero.service';
import { CandidatoService } from '../../../../modulos/Candidato/candidato.service';
import { EstadoBusquedaLaboralService } from '../../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral.service';
import { EstadoBusquedaLaboral } from '../../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral';
import { Genero } from '../../../../admin/ABMGenero/genero';
import Swal from 'sweetalert2';
import { url } from 'inspector';
import { ModalService } from '../../../../compartidos/modal/modal.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SeleccionHabilidadesComponent } from '../../../Candidato/perfil-candidato/seleccion-habilidades/seleccion-habilidades.component';
import { Habilidad } from '../../../../admin/ABMHabilidad/habilidad';
import { HabilidadService } from '../../../../admin/ABMHabilidad/habilidad.service';
import { CandidatoHabilidad } from '../../../Candidato/candidato-habilidad';




@Component({
  selector: 'app-registro-candidato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro-candidato.component.html',
  styleUrl: './registro-candidato.component.css'
})
export class RegistroCandidatoComponent {
  candidatoForm: FormGroup;
  submitForm: boolean = false;
  backendEmailInvalido = false;
  verContrasenia: boolean = false;
  backendContraseniaCorta = false;
  backendContraseniasNoCoinciden = false;
  numeropaginaregistro: number = 1;

  modalRef?: NgbModalRef;
  paises: Pais[] =[];
  provincias: Provincia[] = [];
  provinciasDePais: Provincia[] = [];
  generos: Genero[] = [];
  estadosBusquedas: EstadoBusquedaLaboral[] = [];
  todasHabilidades: Habilidad[] = [];
  paisSeleccionado?: Pais;
  provinciaSeleccionada?: Provincia;
  generoSeleccionado?: Genero;
  estadoBusquedaSeleccionado?: EstadoBusquedaLaboral;
  habilidadesSeleccionadasID: number[] = []; // array de ids de las habildiades que le quedaron al candidato
  habilidadesFinales: any; // array de habilidades que le quedaron al candidato

  habilidades: CandidatoHabilidad[] = []; // listado de habilidades seleccionadas por el usuario
  candidato: any = {}; // necesario solo para hacer `this.candidato.habilidades ?? []`


constructor(
  private router: Router,
  private paisService: PaisService,
  private provinciaService: ProvinciaService,
  private generoService: GeneroService,
  private estadoBusquedaService: EstadoBusquedaLaboralService,
  private candidatoService: CandidatoService,
  private modalService: ModalService,
  private habilidadService: HabilidadService

) {
  this.candidatoForm = new FormGroup({
    nombreCandidato: new FormControl('', [Validators.required]),
    apellidoCandidato: new FormControl('', [Validators.required]),
    fechaDeNacimiento: new FormControl('', [Validators.required]),
    provinciaCandidato: new FormControl(null, [Validators.required]),
    paisCandidato: new FormControl(null, [Validators.required]),
    estadoBusquedaCandidato: new FormControl(''),
    generoCandidato: new FormControl(null, [Validators.required]),
    habilidadesCandidato: new FormControl(''),
    CVCandidato: new FormControl(''),
    correoCandidato: new FormControl('', [Validators.required, Validators.email]),
    contrasenia: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repetirContrasenia: new FormControl('', [Validators.required, Validators.minLength(8)]),
    urlFotoPerfil: new FormControl(''),
    terminosCondiciones: new FormControl(false, [Validators.requiredTrue]),
  })
}

ngOnInit(): void {
  this.generoService.findAll().subscribe({ //CAMBIAR A FINDALL ACTIVE
      next: (data) => {
        this.generos = data;
        // console.log(this.paises)
      },
      error: (error) => {
        console.error('Error al obtener generos', error);
      }
  })

  this.paisService.findAll().subscribe({
      next: (data) => {
        this.paises = data;
        // console.log(this.paises)
      },
      error: (error) => {
        console.error('Error al obtener paises', error);
      }
  })

  this.provinciaService.findAll().subscribe({
      next: (data) => {
        this.provincias = data;
        },
      error: (error) => {
        console.error('Error al obtener provincias', error);
      }
  })

  this.estadoBusquedaService.findAll().subscribe({ //CAMBIAR A FINDALL ACTIVE
      next: (data) => {
        this.estadosBusquedas = data;
        // console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener rubros', error);
      }
  })

  this.habilidadService.findAllActivas().subscribe(habilidades => {
      this.todasHabilidades = habilidades;
  });

  this.habilidades = [];


}

enviarDatos() {
    this.backendEmailInvalido = false;
    this.submitForm = true;

    if (this.candidatoForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios y acepte los Términos y Condiciones.',
      });
      return;
    }

    const nombreCandidato = this.candidatoForm.get('nombreCandidato')?.value;
    const apellidoCandidato = this.candidatoForm.get('apellidoCandidato')?.value;
    const fechaDeNacimiento = this.candidatoForm.get('fechaDeNacimiento')?.value;
    const provinciaSeleccionada = this.candidatoForm.get('provinciaCandidato')?.value.id;
    const estadoBusquedaSeleccionado = this.candidatoForm.get('estadoBusquedaCandidato')?.value.id;
    const generoSeleccionado = this.candidatoForm.get('generoCandidato')?.value.id; 
    const habilidadesCandidato = this.candidatoForm.get(['habilidadesCandidato'])?.value.id; 
    const enlaceCV = this.candidatoForm.get('CVCandidato')?.value;
    const correoCandidato = this.candidatoForm.get('correoCandidato')?.value; 
    const contrasenia = this.candidatoForm.get('contrasenia')?.value;
    const repetirContrasenia = this.candidatoForm.get('repetirContrasenia')?.value;
    const urlFotoPerfil = this.candidatoForm.get('urlFotoPerfil')?.value; 

    if (this.candidatoForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios y acepte los Términos y Condiciones.',
      });
      return;
    }

    if (contrasenia !== repetirContrasenia) {
      this.backendContraseniasNoCoinciden = true;
      this.candidatoForm.get('contrasenia')?.setErrors({ backend: true });
      this.candidatoForm.get('repetirContrasenia')?.setErrors({ backend: true });
      Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Las contraseñas no coinciden",
          timer: 3000,
          showConfirmButton: false,
      });
        return; // detener el submit
    }

    this.candidatoService.registrarCandidato(
      nombreCandidato,
      apellidoCandidato,
      fechaDeNacimiento,
      provinciaSeleccionada,
      estadoBusquedaSeleccionado,
      generoSeleccionado,
      this.habilidadesSeleccionadasID,
      enlaceCV,
      correoCandidato,
      contrasenia,
      repetirContrasenia,
      urlFotoPerfil



    ).subscribe({
      next: () => {
        this.submitForm = true;
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Te has registrado correctamente",
          timer: 3000,
          showConfirmButton: false,
        });
      },
      error: (error: any) => {
          if (error.error.message === "El correo ingresado ya se encuentra en uso") {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "warning",
              title: "El correo ingresado se encuentra en uso, ingrese otro",
              timer: 3000,
              showConfirmButton: false,
            })
          }
          if (error.status === 400 && error.error.message === "Debe ser un correo válido") {
            this.backendEmailInvalido = true;
            this.candidatoForm.get('emailEmpresa')?.setErrors({ backend: true });
          } else if (error.status === 400 && error.error.message === "La contraseña debe tener al menos 8 caracteres") {
            this.backendContraseniaCorta = true;
            this.candidatoForm.get('contrasenia')?.setErrors({ backend: true });
          }
        }
      });      

}

isCampoInvalido(nombreCampo: string): boolean {
  const control = this.candidatoForm.get(nombreCampo);
  return !!(control && control.invalid && (control.touched || this.submitForm));
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
}

get habilidadesParaMostrar(): CandidatoHabilidad[] {
  return this.habilidadesFinales === undefined ? this.habilidades : this.habilidadesFinales;
}



compararPais = (p1: Pais, p2: Pais) => p1 && p2 ? p1.id === p2.id : p1 === p2;
compararProvincia = (p1: Provincia, p2: Provincia) => p1 && p2 ? p1.id === p2.id : p1 === p2;
compararGenero = (r1: Genero, r2: Genero) => r1 && r2 ? r1.id === r2.id : r1 === r2;
compararEstadoBusqueda = (e1: EstadoBusquedaLaboral, e2: EstadoBusquedaLaboral) => e1 && e2 ? e1.id === e2.id : e1 === e2;

siguientepagina() {
  this.numeropaginaregistro ++;
}

paginaAnterior() {
  this.numeropaginaregistro --;
}

filtrarProvinciasPorPais(paisSeleccionado: Pais | null) {
  if (!paisSeleccionado) {
      this.provinciasDePais = [];
      const pais = this.candidatoForm.get('paisCandidato')?.value;
      return;
  }

  this.provinciasDePais = this.provincias.filter(
      provincia => provincia.pais?.id === paisSeleccionado.id
  );

  this.paisSeleccionado = paisSeleccionado;

  }


  editarCV(){
    console.log('Editar CV');
  }

  eliminarCV(){
    console.log('Eliminar CV');
  }

  verterminosycondiciones() {
    Swal.fire({
      title: 'Términos y Condiciones',
      html: `
        <div style="text-align: left; max-height: 300px; overflow-y: auto; font-size: 14px;">
          <p><strong>1. Introducción</strong></p>
          <p>Al registrarse como empresa, usted acepta cumplir con estos términos y condiciones...</p>
  
          <p><strong>2. Responsabilidades</strong></p>
          <p>La empresa es responsable de la veracidad de la información ingresada...</p>
  
          <p><strong>3. Uso de la información</strong></p>
          <p>Los datos proporcionados serán utilizados únicamente para fines comerciales internos...</p>
  
          <p><strong>4. Modificaciones</strong></p>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento sin previo aviso...</p>
  
          <p><strong>5. Aceptación</strong></p>
          <p>Al continuar con el proceso de registro, usted acepta estos términos en su totalidad.</p>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'swal2-border-radius',
        confirmButton: 'btn-confirmar'
      }

    });
  }


}
