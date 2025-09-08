import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { TipoContrato } from '../../../../admin/ABMTipoContrato/tipo-contrato';
import { TipoContratoService } from '../../../../admin/ABMTipoContrato/tipo-contrato.service';
import Swal from 'sweetalert2';
import { Modalidad } from '../../../../admin/ABMModalidad/modalidad';
import { ModalidadService } from '../../../../admin/ABMModalidad/modalidad.service';
import { Habilidad } from '../../../../admin/ABMHabilidad/habilidad';
import { OfertaHabilidad } from '../../../oferta/oferta-habilidad';
import { HabilidadService } from '../../../../admin/ABMHabilidad/habilidad.service';
import { OfertaService } from '../../../oferta/oferta.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../compartidos/modal/modal.service';
import { SeleccionHabilidadesComponent } from '../../../Candidato/perfil-candidato/seleccion-habilidades/seleccion-habilidades.component';
import { EtapaService } from '../../../../admin/ABMEtapa/etapa.service';
import { Etapa } from '../../../../admin/ABMEtapa/etapa';
import { SesionService } from '../../../../interceptors/sesion.service';
import { Empleado } from '../../../empresa/empleados/empleado';
import { EmpresaService } from '../../../empresa/empresa/empresa.service';
import { ofertaEtapaDTO } from '../ofertaEtapaDTO';

@Component({
  selector: 'app-crear-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './crear-oferta.component.html',
  styleUrl: './crear-oferta.component.css'
})
export class CrearOfertaComponent implements OnInit {

  crearofertaForm: FormGroup;
  submitForm: boolean = false;
  tipocontratos: TipoContrato[] = [];
  modalidades: Modalidad [] = [];
  modalRef?: NgbModalRef;

  todasHabilidades: Habilidad[] = [];
  habilidadesSeleccionadasID: number[] = []; // array de ids de las habildiades que le quedaron 
  habilidadesFinales: any; // array de habilidades que le quedaron
  habilidades: OfertaHabilidad[] = [];

  etapasDisponibles: Etapa[] = [];
  etapasSeleccionadas: ofertaEtapaDTO[] = [];

  idEmpresaObtenida!: number;
  constructor(
    private router: Router,
    private tipocontratoService: TipoContratoService,
    private modalidadService: ModalidadService,
    private habilidadService: HabilidadService,
    private ofertaService: OfertaService,
    private modalService: ModalService,
    private etapaService: EtapaService,
    private empresaService: EmpresaService,

  ){
  this.crearofertaForm = new FormGroup({
    titulo: new FormControl('', [Validators.required]),
    tipocontrato: new FormControl('', [Validators.required]),
    modalidad: new FormControl('', [Validators.required]),
    descripcionOferta: new FormControl('', [Validators.required]),
    responsabilidadesOferta: new FormControl('', [Validators.required]),
    habilidadesOferta: new FormControl('')
  });
  }

ngOnInit(){
  this.tipocontratoService.findAll().subscribe({
    next: (data) => {
      this.tipocontratos = data;
  },
    error: (error) => {
      console.error('Error al obtener los tipos de contrato', error);
    }
  })

  this.modalidadService.findAll().subscribe({
    next: (data) => {
      this.modalidades = data;
  },
    error: (error) => {
      console.error('Error al obtener las modalidades', error);
    }
  })

  this.habilidadService.findAllActivas().subscribe(habilidades => {
      this.todasHabilidades = habilidades;
  });

  this.habilidades = [];

  if (this.empresaService) {
    console.log('entra a empresa service')
    this.empresaService.getidEmpresabyCorreo()?.subscribe({
        next: (idEmpresa) => {
          if (idEmpresa !== undefined && idEmpresa !== null) {
            this.idEmpresaObtenida = idEmpresa;
            console.log('id empresa obtenido: ', idEmpresa)
            this.etapaService.obtenerEtapasDisponiblesParaEmpresa(idEmpresa).subscribe({
              next: (etapas) => {
                this.etapasDisponibles = etapas;
                console.log('etapas disponibles: ', this.etapasDisponibles)
              },
              error: (err) => {
                console.error('Error al obtener etapas disponibles', err);
              }
            });
          } else {
            console.error('El id de empresa obtenido es undefined o null');
          }
        },
        error: (err) => {
          console.error('Error al obtener id de empresa por correo', err);
        }
    });
  }


}

  enviarDatos(){
    this.submitForm = true;

    if (this.crearofertaForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos obligatorios y acepte los Términos y Condiciones.',
      });
      return;
    }
      
    const titulo = this.crearofertaForm.get('titulo')?.value;
    const descripcion = this.crearofertaForm.get('descripcion')?.value;
    const modalidadSeleccionada = this.crearofertaForm.get('modalidad')?.value.id;
    const tipocontratoSeleccionado = this.crearofertaForm.get('tipocontrato')?.value.id;
    const responsabilidades = this.crearofertaForm.get('responsabilidades')?.value;

    this.ofertaService.crearOferta(
      titulo,
      descripcion,
      responsabilidades,
      modalidadSeleccionada,
      tipocontratoSeleccionado,
      this.habilidadesSeleccionadasID,
    ).subscribe({
        next: () => {
                Swal.fire({
                  toast: true,
                  position: "top-end",
                  icon: "success",
                  title: "La oferta se ha creado exitosamente",
                  timer: 3000,
                  showConfirmButton: false,
                });
              },
    })
    
  }

  isCampoInvalido(nombreCampo: string): boolean {
    const control = this.crearofertaForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.submitForm));
  }
  compararTipoContrato = (p1: TipoContrato, p2: TipoContrato) => p1 && p2 ? p1.id === p2.id : p1 === p2;


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

          const habilidadesFinales: OfertaHabilidad[] = result.map((id: number | undefined) => {
            const habilidadEncontrada = this.todasHabilidades.find(h => h.id === id);
            return {
              habilidad: habilidadEncontrada
            } as OfertaHabilidad;
          }).filter((ch: { habilidad: undefined; }) => ch.habilidad !== undefined);

          this.habilidades = habilidadesFinales;
          }
        }
      )
  }

  get habilidadesParaMostrar(): OfertaHabilidad[] {
    return this.habilidadesFinales === undefined ? this.habilidades : this.habilidadesFinales;
  }


  agregarEtapa(etapa: Etapa){
    this.etapasSeleccionadas.push
  }
}
