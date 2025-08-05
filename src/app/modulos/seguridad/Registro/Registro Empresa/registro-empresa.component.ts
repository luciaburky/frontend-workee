import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // CORREGIDO: antes estaba mal con 'express'
import { CommonModule } from '@angular/common'; // <-- necesario para *ngIf, ngClass, etc
import { registroserviceempresa } from './registro.service';
import { PaisService } from '../../../../admin/ABMPais/pais.service';
import { ProvinciaService } from '../../../../admin/ABMProvincia/provincia.service';
import { RubroService } from '../../../../admin/ABMRubro/rubro.service';
import { Pais } from '../../../../admin/ABMPais/pais';
import { Provincia } from '../../../../admin/ABMProvincia/provincia';
import { Rubro } from '../../../../admin/ABMRubro/rubro';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../empresa/empresa/empresa.service';
import Swal from 'sweetalert2';
import { dir } from 'console';

@Component({
  selector: 'app-registro-empresa',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro-empresa.component.html',
  styleUrl: './registro-empresa.component.css'
})
export class RegistroEmpresaComponent implements OnInit{
  empresaForm: FormGroup;
  submitForm: boolean = false;
  backendEmailInvalido = false;
  verContrasenia: boolean = false;
  backendContraseniaCorta = false;
  backendContraseniasNoCoinciden = false;
  numeropaginaregistro: number = 1;

  paises: Pais[] =[];
  provincias: Provincia[] = [];
  provinciasDePais: Provincia[] = [];
  rubros: Rubro[] = [];
  paisSeleccionado?: Pais;
  provinciaSeleccionada?: Provincia;
  rubroSeleccionado?: Rubro;

constructor(

    private router: Router,
    private registroservice: registroserviceempresa,
    private paisService: PaisService,
    private provinciaService: ProvinciaService,
    private rubroService: RubroService,
    private empresaService: EmpresaService,
    

  ) {

    this.empresaForm = new FormGroup({
      nombreEmpresa: new FormControl('', [Validators.required]),
      descripcionEmpresa: new FormControl('', [Validators.required]),
      telefonoEmpresa: new FormControl('', [Validators.required]),
      direccionEmpresa: new FormControl('', [Validators.required,]),
      numeroIdentificacionFiscal: new FormControl('', [Validators.required, Validators.minLength(8)]),
      urlFotoPerfil: new FormControl(''),
      urlDocumentoLegal: new FormControl(''),
      rubroEmpresa: new FormControl(null, [Validators.required]),
      sitioWebEmpresa: new FormControl(''),
      emailEmpresa: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repetirContrasenia: new FormControl('', [Validators.required, Validators.minLength(8)]),
      paisEmpresa: new FormControl(null, Validators.required),
      provinciaEmpresa: new FormControl(null, Validators.required),
      terminosCondiciones: new FormControl(false, [Validators.requiredTrue]),
    })
  }

  //SE EJECUTA DSP DEL CONSTRUCTOR
  
  ngOnInit(): void {

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

    console.time('Carga rubros');
    this.rubroService.findAllActivos().subscribe({
      next: (data) => {
        this.rubros = data;
        // console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener rubros', error);
      }
    })
    
  }


  
  isCampoInvalido(nombreCampo: string): boolean {
    const control = this.empresaForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.submitForm));
  }


  enviarDatos() {

    this.backendEmailInvalido = false;
    this.submitForm = true;

    if (this.empresaForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios y acepte los Términos y Condiciones.',
      });
      return;
    }
    
    const nombreEmpresa  = this.empresaForm.get('nombreEmpresa')?.value;
    const descripcionEmpresa = this.empresaForm.get('descripcionEmpresa')?.value;
    const telefonoEmpresa = this.empresaForm.get('telefonoEmpresa')?.value;
    const direccionEmpresa = this.empresaForm.get('direccionEmpresa')?.value;
    const numeroIdentificacionFiscal = this.empresaForm.get('numeroIdentificacionFiscal')?.value;
    const emailEmpresa = this.empresaForm.get('emailEmpresa')?.value;
    const contrasenia = this.empresaForm.get('contrasenia')?.value;
    const repetirContrasenia = this.empresaForm.get('repetirContrasenia')?.value;
    const urlFotoPerfil = 'https://github.com'; //CAMBIAR
    const urlDocumentoLegal = this.empresaForm.get('urlDocumentoLegal')?.value;
    const sitioWebEmpresa = this.empresaForm.get('sitioWebEmpresa')?.value; 
    const rubroSeleccionado = this.empresaForm.get('rubroEmpresa')?.value.id;
    const provinciaSeleccionada = this.empresaForm.get('provinciaEmpresa')?.value.id;

    console.log('Datos enviados');

    if (this.empresaForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios y acepte los Términos y Condiciones.',
      });
      return;
    }

    if (contrasenia !== repetirContrasenia) {
      this.backendContraseniasNoCoinciden = true;
      this.empresaForm.get('contrasenia')?.setErrors({ backend: true });
      this.empresaForm.get('repetirContrasenia')?.setErrors({ backend: true });
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


this.empresaService.registrarEmpresa(
  nombreEmpresa,
  descripcionEmpresa,
  telefonoEmpresa,
  direccionEmpresa,
  rubroSeleccionado,
  numeroIdentificacionFiscal,
  emailEmpresa,
  contrasenia,
  repetirContrasenia,
  provinciaSeleccionada,
  urlFotoPerfil,
  urlDocumentoLegal,
  sitioWebEmpresa
).subscribe({
  next: () => {
    this.submitForm = true;
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "La empresa se ha registrado correctamente",
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
        this.empresaForm.get('emailEmpresa')?.setErrors({ backend: true });
      } else if (error.status === 400 && error.error.message === "La contraseña debe tener al menos 8 caracteres") {
        this.backendContraseniaCorta = true;
        this.empresaForm.get('contrasenia')?.setErrors({ backend: true });
      }
    }
  });      
      
  }


  compararPais = (p1: Pais, p2: Pais) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  compararProvincia = (p1: Provincia, p2: Provincia) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  compararRubro = (r1: Rubro, r2: Rubro) => r1 && r2 ? r1.id === r2.id : r1 === r2;



  filtrarProvinciasPorPais(paisSeleccionado: Pais | null) {
    if (!paisSeleccionado) {
      this.provinciasDePais = [];
      const pais = this.empresaForm.get('paisEmpresa')?.value;
      return;
    }

    this.provinciasDePais = this.provincias.filter(
      provincia => provincia.pais?.id === paisSeleccionado.id
    );

    this.paisSeleccionado = paisSeleccionado;

    // if (!this.provinciasDePais.some(p => p.id === this.candidato.provincia?.id)) {
    //   this.candidato.provincia = undefined;
    // }
  }

  siguientepagina() {
    this.numeropaginaregistro++;}

  paginaAnterior() {
    this.numeropaginaregistro--;}

  editarCV() {
    console.log("Editar CV");
  }

  eliminarCV() {
    console.log("Eliminar CV");
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
    width: '600px',
    customClass: {
      popup: 'swal2-border-radius',
    }
  });
}


}
