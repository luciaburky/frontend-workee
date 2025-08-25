import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../compartidos/modal/modal.service';
import { RolService } from '../../usuarios/rol.service';
import { RecargarService } from '../../../../admin/recargar.service';
import { Rol } from '../../rol';
import { permiso } from '../permiso';
import { permisoRol } from '../rol-permiso';
import { PermisoService } from '../permiso.service';
import Swal from 'sweetalert2';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../../categoria';
import { Console } from 'console';

@Component({
  selector: 'app-crear-rol',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-rol.component.html',
  styleUrl: './crear-rol.component.css'
})
export class CrearRolComponent {
  RolForm: FormGroup;
  modalRef?: NgbModalRef;
  submitForm: boolean = false;
  todosPermisos: permiso[] = [];
  permisosFinales:any;
  permisos: permisoRol[] = [];
  rol:any = {};
  categorias: Categoria [] = [];
  categoriaSeleccionada?: Categoria;

  permisoDeCategoria: permiso[]=[];
  permisosDisponibles: permiso[] = [];             // permisos según la categoría seleccionada
  permisosSeleccionadosID: number[] = [];          // ids elegidos por el usuario



  constructor(
    private modalService: ModalService,
    private RolService: RolService,
    private recargarService: RecargarService,
    private permisoService: PermisoService,
    private categoriaService: CategoriaService
  ){
    this.RolForm = new FormGroup({
      nombreRol: new FormControl('', [Validators.required]),
      categoriaRol:new FormControl('',[Validators.required]),
      permisosRol: new FormControl('',[Validators.required]),
    });
  }

  ngOnInit(){

    this.categoriaService.findAll().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (error) => {
        console.error('Error al obtener categorias', error);
      }
    })
  }

  dismissModal() {
    this.modalService.dismissActiveModal();
  }

  isCampoInvalido(): boolean {
    const control = this.RolForm.get('nombreRol');
    return !!(control?.hasError('required') && (control?.touched || this.submitForm));
  }


  enviarDatos(){
    console.log(`funciono`)
    console.log('Datos del formulario:', this.RolForm.value);
    if (this.RolForm.invalid) {
      this.RolForm.markAllAsTouched();
      console.log(`entro al if`)
      return;
    }
    const nombrerol = this.RolForm.get('nombreRol')?.value;
    const categoriarol = this.RolForm.get('categoriaRol')?.value;
    console.log(nombrerol)
    
    this.RolService.crearrol(
      nombrerol,
      categoriarol,
      this.permisosSeleccionadosID
    ).subscribe({
          next: () => {
            console.log(nombrerol,categoriarol,this.permisosSeleccionadosID)
            this.recargarService.emitirRecarga();
            this.submitForm = true;
            this.dismissModal();
            
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "El Rol se creó correctamente",
              timer: 3000,
              showConfirmButton: false,
            })
          },
          error: (error) => {
            if (error.error.message === 'Ya existe un rol con ese nombre') {
              Swal.fire({
                toast: true,
                icon: 'warning',
                title: 'Ya existe un rol con ese nombre',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                toast: true,
                icon: 'error',
                title: 'No pudo crearse el rol',
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false
              });
            }
            },
          });
  }

    buscarpermisosSegunCategoria(){
    const cat = this.RolForm.get('categoriaRol')?.value; console.log(cat?.id);
    this.permisoService.permisosdeunaCategoria(cat?.id).subscribe({
      next: (permisos) =>{
        this.todosPermisos = permisos
        console.log(permisos)
      } ,
      
      error: (err) => console.error('Error al obtener permisos', err)
    });

    this.permisos = [];
    }

    mandarPermisosSeleccionados(){
      this.permisosSeleccionadosID = []
    }



  compararCategoria = (r1: Categoria, r2: Categoria) => r1 && r2 ? r1.id === r2.id : r1 === r2;
  compararPermiso = (r1: permiso, r2: permiso) => r1 && r2 ? r1.id === r2.id : r1 === r2;

  onPermisoChange(event: any, idPermiso: number) {
    if (event.target.checked) {
      this.permisosSeleccionadosID.push(idPermiso); 
    } else { 
      this.permisosSeleccionadosID = this.permisosSeleccionadosID.filter(id => id !== idPermiso); 
    }
    console.log(this.permisosSeleccionadosID)
  }


}
