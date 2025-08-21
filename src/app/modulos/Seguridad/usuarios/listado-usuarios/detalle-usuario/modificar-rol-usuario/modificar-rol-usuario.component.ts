import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RolService } from '../../../rol.service';
import { Rol } from '../../../../rol';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalService } from '../../../../../../compartidos/modal/modal.service';
import { Usuario } from '../../../../usuario';
import { UsuarioService } from '../../../usuario.service';
import { UsuarioListadoDTO } from '../../usuario-listado-dto';

@Component({
  selector: 'app-modificar-rol-usuario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modificar-rol-usuario.component.html',
  styleUrl: './modificar-rol-usuario.component.css'
})
export class ModificarRolUsuarioComponent implements OnInit {
  modalRef?: NgbModalRef;
  @Input() idUsuario: number = 0;
  @Input() usuario: UsuarioListadoDTO = {};

  rolActual: string = '';
  rolSeleccionado!: number;

  roles: Rol[] = [];
  
  constructor(
    private rolService: RolService,
    private modalService: ModalService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    this.rolService.findAll().subscribe(data => {
      this.roles = data;
    })

    const rolEncontrado = this.roles.find(r => r.nombreRol === this.usuario.rolActualusuario);
    if (rolEncontrado) {
      this.rolSeleccionado = rolEncontrado.id!;
    }

    this.rolActual = this.usuario.rolActualusuario!;

    // ver si sacar, no se si sirve o no
    // this.rolSeleccionado = this.usuario.rolActualusuario!;
  }

  volverAPerfil() {
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
        console.log(this.rolSeleccionado);
        console.log("envio al service, id usuario: ", this.idUsuario, " id de rol: ", this.rolSeleccionado)
        this.usuarioService.modificarRol(this.idUsuario, this.rolSeleccionado).subscribe({
          next: () => {
            this.modalService.closeActiveModal('rolModificado');
            this.modalService.dismissActiveModal();
            // poner que 
          },
          error: (error) => {
            if(error.error.message === "El rol ingresado no pertenece a la categoria de roles del usuario") {
              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "warning",
                title: "El rol seleccionado no pertenece a la categoría de roles del usuario",
                timer: 3000,
                showConfirmButton: false,
              })
            }
          }
        })        
      }
    })
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
