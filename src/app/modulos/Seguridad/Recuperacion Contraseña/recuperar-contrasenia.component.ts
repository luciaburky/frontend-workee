// import { Component } from '@angular/core';
// import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import { AuthService } from '../auth.service';
// import { CommonModule } from '@angular/common';
// import { ModalService } from '../../../compartidos/modal/modal.service';

// @Component({
//   selector: 'app-recuperar',
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './recuperar-contrasenia.component.html',
//   styleUrl: './recuperar-contrasenia.component.css'
// })
// export class RecuperarContraseniaComponent {
//   recuperarForm: FormGroup;
//   submitForm: boolean = false;
//   backendEmailInvalido = false;
  
//   constructor(
//     private router: Router,
//     private authService: AuthService,
//     private modalService: ModalService
//   ) {
  
//    this.recuperarForm = new FormGroup({
//       correo: new FormControl('', [Validators.required, Validators.email])
//    });
//   }

  // isCampoInvalido(nombreCampo: string): boolean {
  //   const control = this.recuperarForm.get(nombreCampo);
  //   return !!(control && control.invalid && (control.touched || this.submitForm));
  // }

//   solicitarRecuperacionContrasenia() {
//     this.submitForm = true;
//     this.backendEmailInvalido = false;

//     if (this.recuperarForm.invalid) {
//           Swal.fire({
//             icon: 'warning',
//             title: 'Formulario incompleto',
//             text: 'Por favor ingrese un correo electrónico válido.',
//           });
//           return;
//     }

//     const correo = this.recuperarForm.get('correo')?.value;


//     this.authService.solicitarRecuperarContrasenia(correo).subscribe({
//       next: () => {
//         this.submitForm = true;
//           Swal.fire({
//             toast: true,
//             position: "top-end",
//             icon: "success",
//             title: "Se ha enviado la solicitud de recuperación correctamente",
//             timer: 3000,
//            showConfirmButton: false,
//           });
//       },
//       error: (error: any) => {
//       if (error.status === 404) {
//         this.backendEmailInvalido = true;
//         this.recuperarForm.get('correo')?.setErrors({ backend: true });
//         Swal.fire({
//                   toast: true,
//                   position: "top-end",
//                   icon: "warning",
//                   title: "No se encontró un usuario con el correo ingresado",
//                   timer: 3000,
//                   showConfirmButton: false,
//                 })
//       } 
//       }
//     })
//   }

//   dismissModal() {
//       Swal.fire({
//         title: "¿Está seguro de que desea volver?",
//         text: "Los cambios realizados no se guardarán",
//         icon: "question",
//         iconColor: "#31A5DD",
//         showCancelButton: true,
//         confirmButtonColor: "#31A5DD",
//         cancelButtonColor: "#697077",
//         confirmButtonText: "Sí, volver",
//         cancelButtonText: "No, cerrar",
//         reverseButtons: true,
//         customClass: {
//           title: 'titulo-chico',
//         }
//       }).then((result) => {
//         if (result.isConfirmed) {
//           this.modalService.dismissActiveModal();
//       }});
//     }

// }

import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../../compartidos/modal/modal.service';
import { AuthService } from '../auth.service';


@Component({
  standalone: true,
  selector: 'app-seleccion-habilidades',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrl: './recuperar-contrasenia.component.css'
})
export class RecuperarContraseniaComponent implements OnInit {
  recuperarForm: FormGroup;
  submitForm: boolean = false;
  backendEmailInvalido = false;
  
  modalRef?: NgbModalRef;
  filtro: string = '';
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private modalService: ModalService,
  ) {
    
   this.recuperarForm = new FormGroup({
     correo: new FormControl('', [Validators.required, Validators.email])
    });
  }

  isCampoInvalido(nombreCampo: string): boolean {
    const control = this.recuperarForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.submitForm));
  }


  solicitarRecuperacionContrasenia() {
    this.submitForm = true;
    this.backendEmailInvalido = false;

    if(this.recuperarForm.valid){
      Swal.fire({
        text: "Revise su correo electrónico para restablecer su contraseña.",
        icon: "success",
        confirmButtonColor: "#31A5DD",
      })
    }

    const correo = this.recuperarForm.get('correo')?.value;


    this.authService.solicitarRecuperarContrasenia(correo).subscribe({
      next: () => {
        this.submitForm = true;
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Se ha enviado la solicitud de recuperación correctamente",
            timer: 3000,
           showConfirmButton: false,
          });
      },
      error: (error: any) => {
      if (error.status === 404) {
        this.backendEmailInvalido = true;
        this.recuperarForm.get('correo')?.setErrors({ backend: true });
        Swal.fire({
                  toast: true,
                  position: "top-end",
                  icon: "warning",
                  title: "No se encontró un usuario con el correo ingresado",
                  timer: 3000,
                  showConfirmButton: false,
                })
      } 
      }
    })
  }

  ngOnInit(): void {

  }


  dismissModal() {
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
        this.modalService.dismissActiveModal();
    }});
  }

}
