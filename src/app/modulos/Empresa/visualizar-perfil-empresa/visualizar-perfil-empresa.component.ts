// import { Component, OnInit } from '@angular/core';
// import { ServiceVisualizarPerfilEmpresaService } from '../servicios/service-visualizar-perfil-empresa.service';

// @Component({
//   selector: 'app-visualizar-perfil-empresa',
//   imports: [],
//   templateUrl: './visualizar-perfil-empresa.component.html',
//   styleUrl: './visualizar-perfil-empresa.component.css'
// })
// export class VisualizarPerfilEmpresaComponent implements OnInit {

//   // nombre_empresa: string;
//   // descripcionEmpresa: string;
//   // numeroIdentificacionFiscal:string;
//   // telefonoEmpresa:Int16Array;
//   // emailEmpresa:string
//   // direccionEmpresa:string;
//   // sitioWebEmpresa:string;
//   // provincia:Provincia;
//   // rubro:Rubro;
//   // constructor() {
//   //   this.nombre_empresa = 'Schneider Electric';
//   // }

//   empresa: any = {};

//   constructor(private ServiceVisualizarPerfilEmpresaService: ServiceVisualizarPerfilEmpresaService) {}

//   ngOnInit(): void {
//     const empresaId = 3; // más adelante, traelo dinámico desde ruta o auth
//     this.ServiceVisualizarPerfilEmpresaService.obtenerEmpresaPorId(empresaId).subscribe({
//       next: (data: any) => {
//         this.empresa = data;
//       },
//       error: (err: any) => {
//         console.error('Error al cargar empresa', err);
//       }
//     });
//   }

// }

// visualizar-perfil-empresa.component.ts
import { Component, OnInit } from '@angular/core';
import { ServiceVisualizarPerfilEmpresaService } from '../servicios/service-visualizar-perfil-empresa.service';

@Component({
  selector: 'app-visualizar-perfil-empresa',
  templateUrl: './visualizar-perfil-empresa.component.html',
  styleUrls: ['./visualizar-perfil-empresa.component.css']
})
export class VisualizarPerfilEmpresaComponent implements OnInit {

  empresa: any = {};

  constructor(private empresaService: ServiceVisualizarPerfilEmpresaService) {}

  ngOnInit(): void {
    const empresaId = 3; // luego este id puede venir de un token o la URL
    this.empresaService.obtenerEmpresaPorId(empresaId).subscribe({
      next: (data) => {
        this.empresa = data;
      },
      error: (err) => {
        console.error('Error al cargar empresa', err);
      }
    });
  }
}
