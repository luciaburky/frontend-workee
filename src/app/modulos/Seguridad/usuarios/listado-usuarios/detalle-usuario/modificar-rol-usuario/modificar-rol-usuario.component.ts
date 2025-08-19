import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RolService } from '../../../rol.service';
import { Rol } from '../../../rol';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalService } from '../../../../../../compartidos/modal/modal.service';
import { Usuario } from '../../../../usuario';
import { UsuarioService } from '../../../usuario.service';

@Component({
  selector: 'app-modificar-rol-usuario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './modificar-rol-usuario.component.html',
  styleUrl: './modificar-rol-usuario.component.css'
})
export class ModificarRolUsuarioComponent implements OnInit {
  modalRef?: NgbModalRef;
  @Input() usuario: Usuario = {};

  rolActual: string = '';
  rolSeleccionado!: number;

  roles: Rol[] = [
    {
      id:1,
      nombreRol:"Pasante Empresa",
      codigoRol:"PASANTE_EMPRESA"
    },
    {
      id:2,
      nombreRol:"Empleado Empresa",
      codigoRol:"EMPLEADO_EMPRESA"
    },
    {
      id:3,
      nombreRol:"Administrador Empresa",
      codigoRol:"ADMIN_EMPRESA"
    },
    {
      id:4,
      nombreRol:"Jefe Empresa",
      codigoRol:"JEFE_EMPRESA"
    },
  ];
  
  constructor(
    private rolService: RolService,
    private modalService: ModalService,
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit(): void {
    // this.rolService.findAll().subscribe(data => {
    //   this.roles = data;
    // })

    const rolEncontrado = this.roles.find(r => r.nombreRol === this.usuario.rolActualUsuario);
    if (rolEncontrado) {
      this.rolSeleccionado = rolEncontrado.id!;
    }

    this.rolActual = this.usuario.rolActualUsuario!;

    // this.rolSeleccionado = this.usuario.rolActualUsuario!;
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

        this.usuarioService.modificarRol(this.usuario.id!, this.rolSeleccionado).subscribe({
          next: () => {
            this.modalService.closeActiveModal('rolModificado');
          },
          error: (err) => {
            console.error("Error al modificar rol", err);
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
