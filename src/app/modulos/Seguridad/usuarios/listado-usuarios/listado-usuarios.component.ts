import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { Usuario } from '../../usuario';
import { Router } from '@angular/router';
import { RolService } from '../rol.service';
import { Rol } from '../rol';

@Component({
  selector: 'app-listado-usuarios',
  imports: [MultiSelect,CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.css'
})
export class ListadoUsuariosComponent implements OnInit {
  
  usuarioList: Usuario[] = [{
      id: 1,
      nombreEntidad: "BHP",
      contraseniaUsuario: "",
      correoUsuario: "bhpadmin@bhp.com",
      rolActualUsuario: "Administrador Empresa"
    },
    {
      id: 2,
      nombreEntidad: "lucia burky",
      contraseniaUsuario: "",
      correoUsuario: "luciaburky1@gmail.com",
      rolActualUsuario: "Candidato"
    },
    {
      id: 3,
      nombreEntidad: "Maximo costa",
      contraseniaUsuario: "",
      correoUsuario: "maxicosta@bhp.com",
      rolActualUsuario: "Empleado Empresa"
    },
    {
      id: 5,
      nombreEntidad: "Camila citro",
      contraseniaUsuario: "",
      correoUsuario: "camicitro@mcdonalds.com",
      rolActualUsuario: "Empleado Empresa"
    },
    {
      id: 4,
      nombreEntidad: "MCdonalds",
      contraseniaUsuario: "",
      correoUsuario: "mcdonalds@mcdonalds.com",
      rolActualUsuario: "Administrador Empresa"
    }
  ];
  usuarioListOriginal: Usuario[] = [];

  texto: string = '';

  filtrosRol: Rol[] = [];
  filtrosSeleccionadosRoles: any[] = [];
  
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private rolService: RolService,
  ) {}
  
  ngOnInit(): void {
    // this.usuarioService.findAll().subscribe(data => {
    //   this.usuarioListOriginal = data;
    // })

    this.rolService.findAll().subscribe(data => {
      this.filtrosRol = data;
      this.filtrosRol = this.filtrosRol.map(r => ({
          ...r,
          name: `${r.nombreRol}`
        })
      )
    })
  }

  buscarUsuarios() {
    const textoLimpio = this.texto.trim().toLowerCase();

    if (textoLimpio === '') {
      this.usuarioList = [... this.usuarioListOriginal ];
      return;
    }

    this.usuarioList = this.usuarioListOriginal.filter(usuario =>
      usuario.correoUsuario?.toLowerCase().includes(textoLimpio)
    );
  }
  
  irADetalle(idUsuario:number) {
    console.log("detalle de usuario: ", idUsuario);
    this.router.navigate([`usuarios/detalle`,idUsuario]);
  }
  
  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.usuarioList.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerUsuariosPaginados(): Usuario[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.usuarioList.slice(inicio, fin);
  }

  avanzarPagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }
  
  retrocederPagina(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

}
