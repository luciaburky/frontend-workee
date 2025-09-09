import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { SesionService } from '../../../../interceptors/sesion.service';
// import { Modal } from 'bootstrap';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../compartidos/modal/modal.service';
import { RecuperarContraseniaModal } from '../../Recuperacion Contraseña/Modal/recuperar-contrasenia-modal.component';
//import { RecuperarContraseniaComponent } from '../../Recuperacion Contraseña/recuperar-contrasenia.component';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup
  verContrasenia: boolean = false;
  submitForm: boolean = false;
  backendEmailInvalido = false;
  modalRef?: NgbModalRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sesionService: SesionService,
    private modalService: ModalService,
  ) {
    this.loginForm = new FormGroup({
      correo: new FormControl('',[Validators.required, Validators.email]),
      contrasenia: new FormControl('',[Validators.required])
    });
  }

  enviarDatos(){
    this.backendEmailInvalido = false;
    this.submitForm = true;

    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo electronico o contraseña incompleto',
        text: 'Por favor, complete los campos correo electronico y contraseña',
      });
      return;
    }
    const correo = this.loginForm.get('correo')?.value.trim();
    const contrasenia = this.loginForm.get('contrasenia')?.value.trim();

    console.log("Datos que se van a enviar:", { correo, contrasenia });

  this.authService.login(correo, contrasenia).subscribe({
    next: (token: string) => {
      this.sesionService.startLocalSession(token);
      this.router.navigate(['/registro']);
    },
    error: () => {
      console.log('Credenciales inválidas');
      Swal.fire({ icon: 'error', title: 'Credenciales inválidas' });
    }
  }
);

  }

togglePasswordView() {
throw new Error('Method not implemented.');
}

// irRestablecerContrasenia() {
//   const modalElement = document.getElementById('modalRecuperar');

//    this.modalRef = this.modalService.open(RecuperarContraseniaComponent, {
//       centered: true,
//       scrollable: true,
//       size: 'lg'
//     });

// }

irRestablecerContrasenia() {
  this.modalRef = this.modalService.open(RecuperarContraseniaModal, {
    centered: true,
    scrollable: true,
    size: 'lg'
  });

  
}






username: any;
passwordType: any;
onSubmit() {
throw new Error('Method not implemented.');
}

isCampoInvalido(nombreCampo: string): boolean {
    const control = this.loginForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.submitForm));
}

}