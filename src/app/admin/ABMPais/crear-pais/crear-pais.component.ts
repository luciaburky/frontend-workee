import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { PaisService } from '../pais.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-pais',
  imports: [CommonModule],
  templateUrl: './crear-pais.component.html',
  styleUrl: './crear-pais.component.css'
})
export class CrearPaisComponent {
  paisForm?: FormGroup | null;
  id?: number | null;
  modalRef?: NgbModalRef;
  submitForm: boolean = false;
  paisCreado: boolean = true;
  constructor(
    private modalService: ModalService,
    private paisService: PaisService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.paisForm = new FormGroup({
      pais: new FormControl('', [Validators.required])
    });
    this.paisService.getId().subscribe({
      next: (response) => {
        this.id = response;
      },
    });
    // this.toastr.success('', '¡País creado correctamente!');
  }

  dismissModal() {
    this.modalService.dismissActiveModal();
  }

  enviarDatos() {
    this.submitForm = true;
    if (this.paisForm?.invalid) return;
    this.paisService
      .agregarPais(
        this.paisForm?.get('pais')?.value
      )
      .subscribe({
        next: (response) => {
          this.dismissModal();
          // this.toastr.success('', '¡País creado correctamente!', {
          //   timeOut: 2500,
          // });
        },
        error: (error) => {
          if (error.error.mensaje === 'Ya existe un país con el mismo nombre.') {
            // this.toastr.warning('', 'Ya existe un país con el mismo nombre', {
            // timeOut: 2500});
          } else {
            // this.toastr.error('', 'Algo salió mal, intente nuevamente', {
            // timeOut: 2500});
          }
          this.dismissModal();
        },
      });
  }
  
}