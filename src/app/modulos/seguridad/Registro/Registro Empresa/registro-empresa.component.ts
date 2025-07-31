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


@Component({
  selector: 'app-registro-empresa',
  standalone: true, // asegúrate de que esto esté presente si es un componente standalone
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // <-- IMPORTS necesarios
  templateUrl: './registro-empresa.component.html',
  styleUrl: './registro-empresa.component.css'
})
export class RegistroEmpresaComponent implements OnInit{
  empresaForm: FormGroup;
  submitForm: boolean = false;
  backendEmailInvalido = false;
  verContrasenia: boolean = false;
  backendContraseniaCorta = false;
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
    private rubroService: RubroService
    
    

  ) {

    this.empresaForm = new FormGroup({
      nombreEmpresa: new FormControl('', [Validators.required]),
      descripcionEmpresa: new FormControl('', [Validators.required]),
      telefonoEmpresa: new FormControl('', [Validators.required]),
      direccionEmpresa: new FormControl('', [Validators.required, Validators.email]),
      numeroIdentificacionFiscal: new FormControl('', [Validators.required, Validators.minLength(8)]),
      urlFotoPerfil: new FormControl('', [Validators.required]),
      urlDocumentoLegal: new FormControl('', [Validators.required]),
      rubroEmpresa: new FormControl(null, [Validators.required]),

      emailEmpresa: new FormControl('', [Validators.required, Validators.email]),
      contrasenia: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repetirContrasenia: new FormControl('', [Validators.required, Validators.minLength(8)]),


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
        // console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener provincias', error);
      }
    })

    console.time('Carga rubros');
    this.rubroService.findAllActivos().subscribe({
      next: (data) => {
        console.timeEnd('Carga rubros');
        this.rubros = data;
        // console.log(this.provincias)
      },
      error: (error) => {
        console.error('Error al obtener rubros', error);
      }
    })
    






  }
  enviarDatos() {
    this.backendEmailInvalido = false;
    const rubroSeleccionado: Rubro = this.empresaForm.get('rubroEmpresa')?.value;

    
    // if (this.empleadoForm.invalid) {
    //   this.empleadoForm.markAllAsTouched();
    //   return;
    };

  
  isCampoInvalido(nombreCampo: string): boolean {

    const control = this.empresaForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.submitForm));
  }


  enviardatos() {
    const nombreEmpresa  = this.empresaForm.get('nombreEmpresa')?.value;
    const descripcionEmpresa = this.empresaForm.get('descripcionEmpresa')?.value;
    const telefonoEmpresa = this.empresaForm.get('telefonoEmpresa')?.value;
    const direccionEmpresa = this.empresaForm.get('direccionEmpresa')?.value;
    const numeroIdentificacionFiscal = this.empresaForm.get('numeroIdentificacionFiscal')?.value;
    const emailEmpresa = this.empresaForm.get('emailEmpresa')?.value;
    const contrasenia = this.empresaForm.get('contrasenia')?.value;
    const repetirContrasenia = this.empresaForm.get('repetirContrasenia')?.value;
    const urlFotoPerfil = this.empresaForm.get('urlFotoPerfil')?.value;
    const urlDocumentoLegal = this.empresaForm.get('urlDocumentoLegal')?.value;
    

  }


  compararPais = (p1: Pais, p2: Pais) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  compararProvincia = (p1: Provincia, p2: Provincia) => p1 && p2 ? p1.id === p2.id : p1 === p2;
  compararRubro = (r1: Rubro, r2: Rubro) => r1 && r2 ? r1.id === r2.id : r1 === r2;



  filtrarProvinciasPorPais(paisSeleccionado: Pais | null) {
    if (!paisSeleccionado) {
      this.provinciasDePais = [];
      // this.candidato.provincia = undefined; // limpiar si no hay país seleccionado
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

}
