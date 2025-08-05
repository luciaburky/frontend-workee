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
import { EstadoBusquedaLaboralService } from '../../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral.service';
import { EstadoBusquedaLaboral } from '../../../../admin/ABMEstadoBusquedaLaboral/estado-busqueda-laboral';
import { Genero } from '../../../../admin/ABMGenero/genero';
import Swal from 'sweetalert2';




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
  numeropaginaregistro: number = 1;

  paises: Pais[] =[];
  provincias: Provincia[] = [];
  provinciasDePais: Provincia[] = [];
  generos: Genero[] = [];
  estadosBusquedas: EstadoBusquedaLaboral[] = [];
  paisSeleccionado?: Pais;
  provinciaSeleccionada?: Provincia;
  generoSeleccionado?: Genero;

constructor(
  private router: Router,
  private paisService: PaisService,
  private provinciaService: ProvinciaService,
  private generoService: GeneroService,
  private estadoBusquedaService: EstadoBusquedaLaboralService,
  //private candidatoService: CandidatoService,

) {
  this.candidatoForm = new FormGroup({
    nombreCandidato: new FormControl('', [Validators.required]),
    apellidoCandidato: new FormControl('', [Validators.required]),
    fechaDeNacimiento: new FormControl('', [Validators.required]),
    provinciaCandidato: new FormControl(null, [Validators.required]),
    paisCandidato: new FormControl(null, [Validators.required]),
    estadoBusquedaCandidato: new FormControl('', [Validators.required]),
    generoCandidato: new FormControl(null, [Validators.required]),
    //habilidadesCandidato: new FormControl('', [Validators.required]),
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
        console.log('Provincias cargadas:', this.provincias);
        },
      error: (error) => {
        console.error('Error al obtener provincias', error);
      }
  })

  this.estadoBusquedaService.findAll().subscribe({ //CAMBIAR A FINDALL ACTIVE
      next: (data) => {
        console.timeEnd('Carga rubros');
        this.estadosBusquedas = data;
        // console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener rubros', error);
      }
  })


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

    const 

}

isCampoInvalido(nombreCampo: string): boolean {
  const control = this.candidatoForm.get(nombreCampo);
  return !!(control && control.invalid && (control.touched || this.submitForm));
}

compararPais = (p1: Pais, p2: Pais) => p1 && p2 ? p1.id === p2.id : p1 === p2;
compararProvincia = (p1: Provincia, p2: Provincia) => p1 && p2 ? p1.id === p2.id : p1 === p2;
compararGenero = (r1: Genero, r2: Genero) => r1 && r2 ? r1.id === r2.id : r1 === r2;

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
