import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { EmpleadoService } from '../empleado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Empleado } from '../empleado';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../seguridad/usuarios/usuario.service';
import { ModalService } from '../../../../compartidos/modal/modal.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CambioContraseniaComponent } from '../../../../compartidos/cambio-contrasenia/cambio-contrasenia.component';
import { SesionService } from '../../../../interceptors/sesion.service';
import { RolService } from '../../../seguridad/usuarios/rol.service';
import { ref, StorageReference, Storage, uploadBytes, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';

@Component({
  selector: 'app-perfil-empleado',
  imports: [FormsModule],
  templateUrl: './perfil-empleado.component.html',
  styleUrl: './perfil-empleado.component.css'
})
export class PerfilEmpleadoComponent implements OnInit {
  empleado: Empleado = {
    id: 0,
    nombreEmpleadoEmpresa: '',
    apellidoEmpleadoEmpresa: '',
    puestoEmpleadoEmpresa: '',
    usuario: {
      id: 0,
      correoUsuario: '',
      contraseniaUsuario: '',
      urlFotoUsuario: '',
    }
  };

  puestoOriginal: string = ''; // en esta variable se guarda el puesto original del empleado recibido desde la BD, sin ningun cambio
  idEmpleado!: number;
  modoEdicion = false;
  
  // CON ESTA VARIABLE, la idea es que cuando se trate del usuario empleado, aparezcan los campos que el mismo puede editar (no el admin)
  // si el empleado ha ingresado en su perfil, esta variable esta en true
  // @Input() esEmpleado: boolean = true;
  esEmpleado!: boolean;
  verContrasenia: boolean = false;
  mostrarCampoRepetir: boolean = false;
  repetirContrasenia: string = '';

  modalRef?: NgbModalRef;
  
  //PARA FOTO DE PERFIL
  urlFoto = '';
  file!: File;
  imgRef!: StorageReference;
  previewUrl!: string;
  fotoTemporal: string = '';
  private storage = inject(Storage);

  constructor(
    private empleadoService: EmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private modalService: ModalService,
    private rolService: RolService,
    private sesionService: SesionService) {}
  
  ngOnInit(): void {
    this.usuarioService.getUsuario().subscribe({
      next: (data) => {
        this.empleado = data;
        console.log(this.empleado)
        const rol = this.sesionService.getRolActual()?.codigoRol
        if (rol === 'EMPLEADO_EMPRESA') {
          this.esEmpleado = true;
        } else {
          this.esEmpleado = false;
        }
      }
    })
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

  async enviarDatos() {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const nuevoPuesto = this.empleado.puestoEmpleadoEmpresa;
        if (!this.esEmpleado) {
          // El administrador es quien esta modificando el perfil del empleado
          this.empleadoService.modificarEmpleadoComoEmpresa(nuevoPuesto ?? '', this.empleado.id!).subscribe({
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
        } else {

          let fotoURL = this.empleado.usuario?.urlFotoUsuario ?? '';
          if (this.file) {
            const subida = await this.subirFoto(this.file);
            if (subida) fotoURL = subida;
          }
          console.log("desde el perfil, esto voy a mandar: ", this.empleado.id!)
          this.empleadoService.modificarEmpleadoComoEmpleado(
          this.empleado.nombreEmpleadoEmpresa ?? '',
          this.empleado.apellidoEmpleadoEmpresa ?? '',
          this.empleado.id!,
          this.empleado.empresa?.id ?? 0,
          fotoURL
        ).subscribe({
          next: () => {
            console.log("pude mandar bien la request")
            this.puestoOriginal = nuevoPuesto ?? '';
            this.modoEdicion = false;
            this.repetirContrasenia = '';
            this.mostrarCampoRepetir = false;
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Tu perfil ha sido actualizado correctamente",
              timer: 3000,
              showConfirmButton: false,
            });
            
          },
          error: (error) => console.error('Error al modificar empleado', error)
          });
        }
        }
      });
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

  onFileSelectedFoto(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      const reader = new FileReader();
      reader.onload = e => this.fotoTemporal = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  async subirFoto(file: File): Promise<string | null> {
    if (!file) return null;
    try {
      const filePath = `foto/${file.name}`;
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      return downloadURL;
    } catch (error) {
      console.error("Error al subir la foto:", error);
      return null;
    }
  }

  verificarFormatoFoto(nombreArchivo: string): boolean {
    const extensionesPermitidas = /\.(jpg|jpeg|png)$/i;
    return extensionesPermitidas.test(nombreArchivo);
  }

  abrirModalContrasenia() {
    this.modalRef = this.modalService.open(CambioContraseniaComponent, {
      centered: true,
      scrollable: true,
      size: 'md'
    });

    this.modalRef.componentInstance.usuarioId = this.empleado.usuario!.id;
  }

}
