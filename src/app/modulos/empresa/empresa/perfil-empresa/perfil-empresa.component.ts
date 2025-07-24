import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa';
import { RubroService } from '../../../../admin/ABMRubro/rubro.service';
import { ProvinciaService } from '../../../../admin/ABMProvincia/provincia.service';
import { Rubro } from '../../../../admin/ABMRubro/rubro';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  selector: 'app-visualizar-perfil-empresa',
  templateUrl: './perfil-empresa.component.html',
  styleUrls: ['./perfil-empresa.component.css']
})
export class PerfilEmpresaComponent implements OnInit {
  empresa: Empresa = {};
  idEmpresa = 0;
  empresaOriginal: Empresa = {
    id: 0,
    nombreEmpresa: '',
    descripcionEmpresa: '',
    numeroIdentificacionFiscal: '',
    telefonoEmpresa: 0,
    emailEmpresa: '',
    direccionEmpresa: '',
    sitioWebEmpresa: '',
    usuario: {
      id: 0,
      correoUsuario: '',
      contraseniaUsuario: '',
      urlFotoUsuario: '',
    }
  };
  modoEdicion = false;
  rubros: Rubro[] = [];

  repetirContrasenia = '';
  idProvincia? = 0;
  nombrePais? = '';
  verContrasenia: boolean = false;
  mostrarCampoRepetir: boolean = false;

  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router,
    private rubroService: RubroService,
    private provinciaService: ProvinciaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.empresaService.findById(id).subscribe({
      next: (data) => {
        this.empresa = data;
        this.empresaOriginal = JSON.parse(JSON.stringify(data));
        this.idProvincia = this.empresa.provincia?.id;
        this.idEmpresa = this.empresa.id ?? 0;
        console.log(this.empresa.usuario?.contraseniaUsuario)
      },
      error: (error) => {
        console.error('Error al obtener empresa', error);
      }
    });

    if (this.idProvincia !== undefined && this.idProvincia !== null) {
      this.provinciaService.findById(this.idProvincia).subscribe({
        next: (provincia) => {
          this.nombrePais = provincia.pais?.nombrePais;
          console.log(this.nombrePais)
        }
      });
    }
    
    this.rubroService.findAllActivos().subscribe({
      next: (data) => {
        this.rubros = data;
      },
      error: (error) => {
        console.error('Error al obtener rubros', error);
      }
    })
  }

  modificarEmpresa() {
    this.modoEdicion = true;
    
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
    }})
  .then((result) => {
        if (result.isConfirmed) {
          this.empresaService.eliminarEmpresa(this.idEmpresa).
          subscribe({
            next: () => {
              this.modoEdicion = false;
              this.volver();
              // TODO: QUE PONEMOS ACA?
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "La empresa ha sido eliminada exitosamente.",
                timer: 3000,
                showConfirmButton: false,
              })
              this.router.navigate([`login`])    
            },
            error: (error) => {
              console.error('Error al modificar empleado', error)
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
        const contrasenia = this.empresa.usuario?.contraseniaUsuario ?? '';
        const repetirContrasenia = this.repetirContrasenia ?? '';
        this.empresaService.modificarEmpresa(this.empresa.id!,
                                            this.empresa.nombreEmpresa ?? '',
                                            this.empresa.descripcionEmpresa ?? '', 
                                            this.empresa.rubro?.id ?? 0,
                                            this.empresa.telefonoEmpresa ?? 0,
                                            this.empresa.direccionEmpresa ?? '',
                                            this.empresa.sitioWebEmpresa ?? '',
                                            contrasenia,
                                            repetirContrasenia
        ).subscribe({
          next: () => {
            this.empresaOriginal = JSON.parse(JSON.stringify(this.empresa));
            this.modoEdicion = false;
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "El perfil de la empresa se modificó correctamente",
              timer: 3000,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error al modificar empresa', error);
            if(error.error.message === "Las contraseñas deben coincidir") {
              Swal.fire({
                toast: true,
                icon: 'warning',
                title: 'Las contraseñas no coinciden',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
              });
            }
            if(error.error.message === "La contraseña debe tener al menos 8 caracteres") {
              Swal.fire({
                toast: true,
                icon: 'warning',
                title: 'La contraseña debe tener al menos 8 caracteres',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
              });
            }
            
            
          
              // TODO: agregar algun msj de error cuando no se envia? por ejemplo si ingrsa 
            // un string en el telefono no se va a enviar, pero no se si vale la pena hacer
            // esa validacion por ejemploy mostrar de que no se envio por eso 
          }
        })
    }});
  }

  volver() {
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
          this.empresa = JSON.parse(JSON.stringify(this.empresaOriginal));
          this.modoEdicion = false;
      }});
    }
  }

  // async editarFoto() {
  //   const { value: file } = await Swal.fire({
  //     title: "Select image",
  //     input: "file",
  //     inputAttributes: {
  //       "accept": "image/*",
  //       "aria-label": "Upload your profile picture"
  //     }
  //   });
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       Swal.fire({
  //         title: "Your uploaded picture",
  //         imageUrl: e.target.result,
  //         imageAlt: "The uploaded picture"
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  compararRubros = (r1: Rubro, r2: Rubro): boolean => {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  };
}