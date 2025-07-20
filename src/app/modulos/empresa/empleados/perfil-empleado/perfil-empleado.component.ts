import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../empleado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioEmpleadoRequest } from '../usuario-empleado-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-empleado',
  imports: [FormsModule],
  templateUrl: './perfil-empleado.component.html',
  styleUrl: './perfil-empleado.component.css'
})
export class PerfilEmpleadoComponent implements OnInit {
  empleado: UsuarioEmpleadoRequest = {};
  puestoOriginal: string = ''; // en esta variable se guarda el puesto original del empleado recibido desde la BD, sin ningun cambio
  idEmpleado!: number;
  modoEdicion = false;

  constructor(
    private empleadoService: EmpleadoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  
  ngOnInit(): void {
    this.idEmpleado = Number(this.route.snapshot.paramMap.get('idEmpleado'));
    this.empleadoService.findById(this.idEmpleado).subscribe({
      next: (data) => {
        this.empleado = { ...data };
        this.puestoOriginal = data.puestoEmpleadoEmpresa ?? '';
      },
      error: (error) => {
        console.error('Error al obtener el empleado', error);
      }
    });

  }

  modificarEmpleado() {
    this.modoEdicion = true;
    this.puestoOriginal = this.empleado.puestoEmpleadoEmpresa ?? '';
  }

  volverAListado() {
    // con esta funcion, si esta en modo edicion, el boton "Volver" lo vuelve al perfil sin editar,
    // si no esta en modo edicion, vuelve al listado completo de todos los empleados
    if (this.modoEdicion) {
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
          this.empleado.puestoEmpleadoEmpresa = this.puestoOriginal;
          this.modoEdicion = false;
      }});
    } else {
      this.router.navigate([`empleados`]);
    }
  }

  enviarDatos() {
    Swal.fire({
      title: '¿Desea confirmar los cambios realizados?',
      icon: "question",
      iconColor: "#70DC73",
      showCancelButton: true,
      confirmButtonColor: "#70DC73",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, volver",
      reverseButtons: true,
      customClass: {
        title: 'titulo-chico',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoPuesto = this.empleado.puestoEmpleadoEmpresa;
        this.empleadoService.modificarEmpleado(nuevoPuesto ?? '', this.idEmpleado).subscribe({
          next: () => {
            this.puestoOriginal = nuevoPuesto ?? '';
            this.modoEdicion = false;
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "La cuenta del empleado se modificó correctamente",
              timer: 3000,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error al modificar empleado', error);
          }
        })
    }});
  }

  eliminarCuenta() {
    Swal.fire({
      title: '¿Desea eliminar al empleado?',
      text: 'Esta acción no se puede deshacer, el empleado será eliminado permanentemente',
      icon: "error",
      iconColor: "#FF5252",
      showCancelButton: true,
      confirmButtonColor: "#FF5252",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, volver",
      reverseButtons: true, 
      customClass: {
        title: 'titulo-chico',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.eliminarEmpleado(this.idEmpleado).subscribe({
          next: () => {
            this.modoEdicion = false;
            this.volverAListado();
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "El empleado ha sido eliminado exitosamente.",
              timer: 3000,
              showConfirmButton: false,
            })
          },
          error: (error) => {
            console.error('Error al eliminar empleado', error);
            if(error.error.message === "Empleado asociado a una etapa de oferta") {
              // TODO: CAMBIAR MESSAGE DE ERROR SEGUN EL ERROR QUE SE AGREGUE EN EL BACK
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "¡El empleado está asociado a una etapa actualmente!",
                text: "No se puede eliminar un empleado que está asignado a una etapa en una oferta no finalizada",
                timer: 3000,
                showConfirmButton: false,
              })
              }
            
          }
        })
    }});
  }

}
