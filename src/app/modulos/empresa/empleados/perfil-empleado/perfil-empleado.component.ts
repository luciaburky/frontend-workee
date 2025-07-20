import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from '../empleado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { UsuarioEmpleadoRequest } from '../usuario-empleado-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil-empleado',
  imports: [],
  templateUrl: './perfil-empleado.component.html',
  styleUrl: './perfil-empleado.component.css'
})
export class PerfilEmpleadoComponent implements OnInit {
  empleado: UsuarioEmpleadoRequest = {};
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
        this.empleado = data;
      },
      error: (error) => {
        console.error('Error al obtener empresa', error);
      }
    });

  }

  modificarEmpleado() {
    this.modoEdicion = true;
  }

  volverAListado() {
    // con esta funcion, si esta en modo edicion, el boton "Volver" lo vuelve al perfil sin editar,
    // si no esta en modo edicion, vuelve al listado completo de todos los empleados
    if (this.modoEdicion) {
      Swal.fire({
        text: "¿Está seguro de que desea volver?\nLos cambios realizados no se guardarán",
        icon: "question",
        iconColor: "#31A5DD",
        showCancelButton: true,
        confirmButtonColor: "#31A5DD",
        cancelButtonColor: "#697077",
        confirmButtonText: "Sí, volver",
        cancelButtonText: "No, cerrar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.modoEdicion = false;
          
      } else {
      }});

    } else {
      this.router.navigate([`empleados`])
    }
  }

  eliminarCuenta() {
    this.empleadoService.eliminarEmpleado(this.idEmpleado).subscribe({
      next: () => {
        this.volverAListado();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "La cuenta del empleado se eliminó correctamente",
          timer: 3000,
          showConfirmButton: false,
        })
      },
      error: (error) => {
        // TODO: error de que no se pudo eliminar el empleado
      }
    })
  }

}
