import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadoService } from '../empleado.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-empleado',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-empleado.component.html',
  styleUrl: './crear-empleado.component.css'
})
export class CrearEmpleadoComponent implements OnInit {
  verContrasenia: boolean = false;
  empleadoForm: FormGroup;
  submitForm: boolean = false;
  backendEmailInvalido = false;
  backendContraseniasNoCoinciden = false;
  backendContraseniaCorta = false;

  constructor(
    private router: Router,
    private empleadoService: EmpleadoService,
  ) {
    this.empleadoForm = new FormGroup({
      nombreEmpleado: new FormControl('', [Validators.required]),
      apellidoEmpleado: new FormControl('', [Validators.required]),
      puestoEmpleado: new FormControl('', [Validators.required]),
      correoEmpleado: new FormControl('', [Validators.required, Validators.email]),
      contraseniaEmpleado: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repetirContraseniaEmpleado: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }
  
  ngOnInit(): void {}

  isCampoInvalido(nombreCampo: string): boolean {
    const control = this.empleadoForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.submitForm));
  }

  enviarDatos() {
    this.backendEmailInvalido = false;
    
    // if (this.empleadoForm.invalid) {
    //   this.empleadoForm.markAllAsTouched();
    //   return;
    // }
    
    const nombreEmpleado = this.empleadoForm.get('nombreEmpleado')?.value;
    const apellidoEmpleado = this.empleadoForm.get('apellidoEmpleado')?.value;
    const puestoEmpleado = this.empleadoForm.get('puestoEmpleado')?.value;
    const correoEmpleado = this.empleadoForm.get('correoEmpleado')?.value;
    const contraseniaEmpleado = this.empleadoForm.get('contraseniaEmpleado')?.value;
    const repetirContraseniaEmpleado = this.empleadoForm.get('repetirContraseniaEmpleado')?.value;

    this.empleadoService.crearEmpleado(
      nombreEmpleado,
      apellidoEmpleado,
      puestoEmpleado,
      correoEmpleado,
      contraseniaEmpleado,
      repetirContraseniaEmpleado).subscribe({
        next: () => {
          this.submitForm = true;
          this.volverAListado();
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "El empleado se creó correctamente",
            timer: 3000,
            showConfirmButton: false,
          })
        },
        error: (error) => {
          console.log(error.error.message);
          if (error.status === 400 && error.error.message === "Debe ser un correo válido") {
            this.backendEmailInvalido = true;
            this.empleadoForm.get('correoEmpleado')?.setErrors({ backend: true });
          } else if (error.status === 400 && error.error.message === "Las contraseñas deben coincidir") {
            this.backendContraseniasNoCoinciden = true;
            this.empleadoForm.get('contraseniaEmpleado')?.setErrors({ backend: true });
            this.empleadoForm.get('repetirContraseniaEmpleado')?.setErrors({ backend: true });
          } else if (error.status === 400 && error.error.message === "La contraseña debe tener al menos 8 caracteres") {
            this.backendContraseniaCorta = true;
            this.empleadoForm.get('contraseniaEmpleado')?.setErrors({ backend: true });
          }
        }
      })
  }

  // erroresDeBackend(mensaje: string) {
  //   const errores = mensaje.split(', ');
  //   console.log(errores)
  //   errores.forEach(error => {
  //     if (error.includes('correo')) {
  //       this.empleadoForm.get('correoEmpleado')?.setErrors({ backend: error });
  //       console.log("setee el error bien")
  //     } else if (error.includes('repetir')) {
  //       this.empleadoForm.get('repetirContraseniaEmpleado')?.setErrors({ backend: error });
  //     } else if (error.includes('contraseña')) {
  //       this.empleadoForm.get('contraseniaEmpleado')?.setErrors({ backend: error });
  //     }
  //     console.log(this.empleadoForm.get('correoEmpleado')?.getError('backend'));
  //   });
  // }

  volverAListado(): void {
    this.router.navigate([`empleados`])
  }

}
