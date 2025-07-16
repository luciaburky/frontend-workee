import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceVisualizarPerfilEmpresaService } from '../servicios/service-visualizar-perfil-empresa.service';

@Component({
  selector: 'app-visualizar-perfil-empresa',
  templateUrl: './visualizar-perfil-empresa.component.html',
  styleUrls: ['./visualizar-perfil-empresa.component.css']
})
export class VisualizarPerfilEmpresaComponent implements OnInit {
  empresa: any = {};

  constructor(
    private empresaService: ServiceVisualizarPerfilEmpresaService,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  console.log('ID recibido:', id);

  this.empresaService.obtenerEmpresaPorId(id).subscribe({
    next: (data) => {
      console.log('Empresa obtenida:', data);
      this.empresa = data;
    },
    error: (error) => {
      console.error('Error al obtener empresa', error);
    }
  });
}





}