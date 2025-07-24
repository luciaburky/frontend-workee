import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EtapaService } from '../etapa.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { RecargarService } from '../../recargar.service';

@Component({
  selector: 'app-crear-etapa',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-etapa.component.html',
  styleUrl: './crear-etapa.component.css'
})
export class CrearEtapaComponent {
  etapaForm: FormGroup;
  modalRef?: NgbModalRef;
  submitForm: boolean = false;
  
  constructor(
    private modalService: ModalService,
    private etapaService: EtapaService,
    private recargarService: RecargarService,
  ) {
    this.etapaForm = new FormGroup({
      etapa: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() { }

  dismissModal() {
    this.modalService.dismissActiveModal();
  }

  isCampoInvalido(nombreCampo: string): boolean {
    const control = this.etapaForm.get(nombreCampo);
    return !!(control?.hasError('required') && (control?.touched || this.submitForm));
  }

  enviarDatos() {
    if (this.etapaForm.invalid) {
      this.etapaForm.markAllAsTouched();
      return;
    }
    const nombreEtapa = this.etapaForm.get('etapa')?.value;
    const descripcionEtapa = this.etapaForm.get('descripcion')?.value;

    this.etapaService.crearEtapa(nombreEtapa,descripcionEtapa).subscribe({
      next: () => {
        this.recargarService.emitirRecarga();
        this.submitForm = true;
        this.dismissModal();
        
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "La etapa se creó correctamente",
          timer: 3000,
          showConfirmButton: false,
        })
      },
      error: (error) => {
        if (error.error.message === 'Ya existe una etapa con ese nombre') {
          Swal.fire({
            toast: true,
            icon: 'warning',
            title: 'Ya existe una etapa con ese nombre',
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            toast: true,
            icon: 'error',
            title: 'No pudo crearse la etapa',
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
          });
        }
        },
      });
  }
  
}
