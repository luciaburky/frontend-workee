import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
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
import { SeleccionHabilidadesComponent } from '../../../candidato/perfil-candidato/seleccion-habilidades/seleccion-habilidades.component';
import { EtapaService } from '../../../../admin/ABMEtapa/etapa.service';
import { Etapa } from '../../../../admin/ABMEtapa/etapa';
import { SesionService } from '../../../../interceptors/sesion.service';
import { Empleado } from '../../../empresa/empleados/empleado';
import { EmpresaService } from '../../../empresa/empresa/empresa.service';
import { ofertaEtapaDTO } from '../ofertaEtapaDTO';
import { Storage, ref, uploadBytes, getDownloadURL, StorageReference } from '@angular/fire/storage';
import { EmpleadoModalComponent } from '../modal empleados/empleado-modal.component';
import { EmpleadoService } from '../../../empresa/empleados/empleado.service';

 function noWhitespaceValidator(ctrl: AbstractControl): ValidationErrors | null {
    const v = (ctrl.value ?? '').toString();
    return v.trim().length > 0 ? null : { whitespace: true };
  }
@Component({
  selector: 'app-crear-oferta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './crear-oferta.component.html',
  styleUrl: './crear-oferta.component.css'
})
export class CrearOfertaComponent implements OnInit {

  faltasEmpleado: number[] = [];
  
  submitted = false;
  crearofertaForm: FormGroup;
  submitForm: boolean = false;
  tipocontratos: TipoContrato[] = [];
  modalidades: Modalidad [] = [];
  modalRef?: NgbModalRef;

  empleadosPorId: Record<number, string> = {};
  private archivosPorEtapa: Record<number, File> = {};
  previewPorEtapa: Record<number, string> = {};
  nombresArchivoPorEtapa: Record<number, string> = {};
  erroresArchivo: Record<number, { formato?: boolean; tamanioInvalido?: boolean }> = {};
  erroresEtapas: Array<{ sinEmpleado?: boolean }> = [];
  

  todasHabilidades: Habilidad[] = [];
  habilidadesSeleccionadasID: number[] = []; // array de ids de las habildiades que le quedaron 
  habilidadesFinales: any; // array de habilidades que le quedaron
  habilidades: OfertaHabilidad[] = [];

  etapasDisponibles: Etapa[] = [];
  etapasSeleccionadas: ofertaEtapaDTO[] = [];

    //PARA Archivo Etapa
    urlArchivoEtapa = '';
    fileArchivoEtapa: any = null;
    docRef!: StorageReference;
    ArchivoEtapaTemporal: any = null;
    today: Date = new Date();
    


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
    private changeDetectorRef: ChangeDetectorRef,
    private storage: Storage,
    private empleadoService: EmpleadoService,

  ){
  this.crearofertaForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, noWhitespaceValidator] }),
    tipocontrato: new FormControl<any | null>(null, { validators: [Validators.required] }),
    modalidad: new FormControl<any | null>(null, { validators: [Validators.required] }),
    descripcionOferta: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, noWhitespaceValidator] }),
    responsabilidadesOferta: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, noWhitespaceValidator] }),
    habilidadesOferta: new FormControl(''),
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

  isCampoInvalido(nombre: string): boolean {
    const c = this.crearofertaForm.get(nombre);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  marcarTodoTocado() {
    Object.values(this.crearofertaForm.controls).forEach(c => c.markAsTouched());
  }

async enviarDatos() {
  this.submitForm = true;
  if (this.crearofertaForm.invalid) {
    Swal.fire({ icon: 'warning', title: 'Formulario incompleto', text: 'Por favor, complete todos los campos obligatorios.' });
    return;
  }

  const etapasOk = this.validarEtapas();
  if (this.crearofertaForm.invalid || !etapasOk) {
    Swal.fire({ icon: 'warning', title: 'Debes tener al menos una etapa en tu oferta', text: 'Por favor, complete todos los campos obligatorios.' });    
    return;
  }

    if (!etapasOk) {
    const detalle = this.faltasEmpleado.length
      ? `Falta asignar un empleado responsable en las etapas: <b>${this.faltasEmpleado.join(', ')}</b>.`
      : 'Revisá los datos de las etapas.';

    Swal.fire({
      icon: 'warning',
      title: 'Asigná responsables',
      html: detalle
    });
    return;
  }
  
  const titulo = this.crearofertaForm.get('titulo')?.value;
  const descripcion = this.crearofertaForm.get('descripcionOferta')?.value;
  const modalidadSeleccionada = this.crearofertaForm.get('modalidad')?.value.id;
  const tipocontratoSeleccionado = this.crearofertaForm.get('tipocontrato')?.value.id;
  const responsabilidades = this.crearofertaForm.get('responsabilidadesOferta')?.value;

  try {
    // (A) SUBIR ARCHIVOS DE TODAS LAS ETAPAS QUE TENGAN FILE
    await this.subirAdjuntosAntesDePost(titulo);

    // (B) POST con ofertaEtapas ya completas (archivoAdjunto = downloadURL o '')
    this.ofertaService.crearOferta(
      titulo,
      descripcion,
      responsabilidades,
      modalidadSeleccionada,
      tipocontratoSeleccionado,
      this.habilidadesSeleccionadasID,
      this.idEmpresaObtenida,
      this.etapasSeleccionadas
    ).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'La oferta se ha creado exitosamente',
          timer: 3000,
          showConfirmButton: false,
        });
        // Limpieza opcional
        this.archivosPorEtapa = {};
        this.previewPorEtapa = {};
        this.nombresArchivoPorEtapa = {};
      },
      error: (err) => {
        console.error('Error al crear oferta', err);
        Swal.fire({ icon: 'error', title: 'Error al crear la oferta', text: 'Revisá los datos e intentá nuevamente.' });
      }
    });
  } catch (e) {
    console.error('Error al subir adjuntos', e);
    Swal.fire({ icon: 'error', title: 'Error al subir documentos', text: 'Revisá los archivos (PDF, <=5MB) e intentá nuevamente.' });
  }
}


private async subirAdjuntosAntesDePost(titulo: string): Promise<void> {
  const tareas: Promise<void>[] = [];

  const carpetaOferta = `ofertas/${this.sanitize(titulo)}_${Date.now()}`;

  for (const [idxStr, file] of Object.entries(this.archivosPorEtapa)) {
    const i = Number(idxStr);
    const etapa = this.etapasSeleccionadas[i];
    if (!etapa || !file) continue;

    const tarea = (async () => {
      const path = `${carpetaOferta}/etapa-${etapa.numeroEtapa}/${file.name}`;
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // PUNTO CLAVE: Seteamos el atributo que espera el backend
      etapa.archivoAdjunto = url;
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    })();

    tareas.push(tarea);
  }

  await Promise.all(tareas);
}

private sanitize(s: string): string {
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-zA-Z0-9-_ ]/g, '')                  // quita raros
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
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


  agregarEtapa(etapa: Etapa) {
    // Evitar duplicados
    const yaSeleccionada = this.etapasSeleccionadas.some(e => e.idEtapa === etapa.id);
    if (yaSeleccionada) return;

    const numeroEtapa = this.etapasSeleccionadas.length + 1;

    const nuevaEtapa: ofertaEtapaDTO = {
      numeroEtapa: numeroEtapa,
      adjuntaEnlace: false,                  // por defecto
      idEtapa: etapa.id!,                     // viene de la etapa seleccionada
      idEmpleadoEmpresa: 0,                  // ⚠️ acá tenés que setear el empleado logueado
      archivoAdjunto: '',
      descripcionAdicional: ''
    };

    this.etapasSeleccionadas.push(nuevaEtapa);
    console.log('etapas seleccionadas: ', this.etapasSeleccionadas)
  }


  quitarEtapa(index: number) {
  this.etapasSeleccionadas.splice(index, 1);
  console.log('etapas seleccionadas: ', this.etapasSeleccionadas)

  // Reordenar los números
  this.etapasSeleccionadas = this.etapasSeleccionadas.map((et, idx) => ({
    ...et,
    numeroEtapa: idx + 1
  }));
}

getNombreEtapa(idEtapa: number): string {
  const etapa = this.etapasDisponibles.find(e => e.id === idEtapa);
  return etapa ? etapa.nombreEtapa! : '';
}

abrirSelectorArchivoEtapa(i: number) {
  document.getElementById('fileArchivoEtapa_' + i)?.click();
}

onArchivoEtapaSelected(event: any, i: number ) {
  const inputEl = event.target as HTMLInputElement;
  const file = inputEl.files?.[0];
  if (!file) return;

  // Reset de errores de esa etapa
  this.erroresArchivo[i] = {};

  // Validaciones
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    this.erroresArchivo[i].formato = true;
    this.changeDetectorRef.detectChanges();
    // Limpio el input para permitir reintento inmediato
    inputEl.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    this.erroresArchivo[i].tamanioInvalido = true;
    this.changeDetectorRef.detectChanges();
    inputEl.value = '';
    return;
  }

  // Guardar para subir luego
  this.archivosPorEtapa[i] = file;
  this.previewPorEtapa[i] = URL.createObjectURL(file);
  this.nombresArchivoPorEtapa[i] = file.name;

  // NO metas blob-URL en el DTO
  this.etapasSeleccionadas[i].archivoAdjunto = '';

  // Dejo el input vacío así puedo volver a elegir el mismo archivo si quiero
  inputEl.value = '';

  this.changeDetectorRef.detectChanges();
}


eliminarArchivoEtapa(i: number) {
  delete this.archivosPorEtapa[i];
  delete this.previewPorEtapa[i];
  delete this.nombresArchivoPorEtapa[i];
  delete this.erroresArchivo[i];

  this.etapasSeleccionadas[i].archivoAdjunto = '';

  // Resetear el input file de esa etapa para permitir re-seleccionar el mismo archivo
  const input = document.getElementById('fileArchivoEtapa_' + i) as HTMLInputElement | null;
  if (input) input.value = '';

  this.changeDetectorRef.detectChanges();
}


toggleAdjuntaEnlace(i: number, checked: boolean) {
  const esPrimeraElegida = this.etapasSeleccionadas[i].numeroEtapa === 1;
  this.etapasSeleccionadas[i].adjuntaEnlace = esPrimeraElegida ? checked : false;

 console.log('etapas seleccionadas: ', this.etapasSeleccionadas)
 }



seleccionarEmpleado(i: number) {
  if (!this.idEmpresaObtenida) return;

  this.modalRef = this.modalService.open(EmpleadoModalComponent, {
    centered: true,
    scrollable: true,
    size: 'lg'
  });

  this.modalRef.componentInstance.empresaId = this.idEmpresaObtenida;

  this.modalRef.result
    .then((empleadoId: number) => {
      if (empleadoId != null) {
        // 1) seteo el ID en la etapa (como ya hacías)
        this.etapasSeleccionadas[i].idEmpleadoEmpresa = empleadoId;
        console.log(`Empleado ${empleadoId} asignado a la etapa #${i + 1}`);

        // 2) traigo el nombre UNA vez y lo cacheo para pintar en la vista
        this.empleadoService.findById(empleadoId).subscribe({
          next: (emp: Empleado) => {
            const nombre = [emp?.nombreEmpleadoEmpresa, emp?.apellidoEmpleadoEmpresa].filter(Boolean).join(' ');
            this.empleadosPorId[empleadoId] = nombre || `Empleado ${empleadoId}`;
            this.changeDetectorRef.detectChanges();
          },
          error: () => { 
            // fallback por si falla
            this.empleadosPorId[empleadoId] = `Empleado ${empleadoId}`;
            this.changeDetectorRef.detectChanges();
          }
        });
      }
    })
    .catch(() => {});
}

borrarEmpleado(i: number){
  this.etapasSeleccionadas[i].idEmpleadoEmpresa = 0;
}

private validarEtapas(): boolean {
  this.erroresEtapas = [];
  this.faltasEmpleado = [];

  if (!this.etapasSeleccionadas || this.etapasSeleccionadas.length === 0) {
    return false; // sin etapas
  }

  let ok = true;

  this.etapasSeleccionadas.forEach((e: any, idx: number) => {
    const err: { sinEmpleado?: boolean } = {};

    // adjuntaEnlace como boolean por las dudas
    if (e.adjuntaEnlace === undefined || e.adjuntaEnlace === null) {
      e.adjuntaEnlace = false;
    }

    // idEtapa fallback si guardaste 'id'
    if (e.idEtapa == null && e.id != null) {
      e.idEtapa = e.id;
    }

    // ⚠️ Falta empleado si es null/undefined o 0
    if (e.idEmpleadoEmpresa == null || e.idEmpleadoEmpresa === 0) {
      err.sinEmpleado = true;
      ok = false;
      this.faltasEmpleado.push((e.numeroEtapa ?? idx + 1));
    }

    this.erroresEtapas[idx] = err;
  });

  return ok;
}


isEtapaSeleccionada(etapa: Etapa): boolean {
  return this.etapasSeleccionadas.some(e => e.idEtapa === etapa.id);
}

getNumeroEtapa(idEtapa: number): number | null {
  const index = this.etapasSeleccionadas.findIndex(e => e.idEtapa === idEtapa);
  return index !== -1 ? index + 1 : null;
}

}
