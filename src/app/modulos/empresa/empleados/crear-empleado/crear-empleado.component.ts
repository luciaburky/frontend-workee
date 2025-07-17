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
  
  constructor(
    private router: Router,
    private empleadoService: EmpleadoService,
  ) {
    this.empleadoForm = new FormGroup({
      nombreEmpleado: new FormControl('', [Validators.required]),
      apellidoEmpleado: new FormControl('', [Validators.required]),
      puestoEmpleado: new FormControl('', [Validators.required]),
      correoEmpleado: new FormControl('', [Validators.required]),
      contraseniaEmpleado: new FormControl('', [Validators.required]),
      repetirContraseniaEmpleado: new FormControl('', [Validators.required])
    })
  }
  
  ngOnInit(): void {}

  isCampoInvalido(nombreCampo: string): boolean {
    // console.log('entre a la funcion con ', nombreCampo)
    const control = this.empleadoForm.get(nombreCampo);
    return !!(control?.hasError('required') && (control?.touched || this.submitForm));
  }

  enviarDatos() {
    if (this.empleadoForm.invalid) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    
    
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

        }
      })


  }

  volverAListado(): void {
    this.router.navigate([`empleados`])
  }

}
