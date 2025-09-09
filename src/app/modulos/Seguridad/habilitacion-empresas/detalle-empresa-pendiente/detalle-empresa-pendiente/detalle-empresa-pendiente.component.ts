import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Empresa } from '../../../../empresa/empresa/empresa';
import { Rubro } from '../../../../../admin/ABMRubro/rubro';
import { AdministradorService } from '../../administrador.service';
import { RubroService } from '../../../../../admin/ABMRubro/rubro.service';
import { ProvinciaService } from '../../../../../admin/ABMProvincia/provincia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../../../empresa/empresa/empresa.service';

@Component({
  selector: 'app-detalle-empresa-pendiente',
  imports: [CommonModule],
  templateUrl: './detalle-empresa-pendiente.component.html',
  styleUrl: './detalle-empresa-pendiente.component.css'
})
export class DetalleEmpresaPendienteComponent implements OnInit{
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
    rubros: Rubro[] = [];
    idProvincia? = 0;
    nombrePais? = '';
  
    constructor(private empresaService: EmpresaService, 
      private rubroService: RubroService, 
      private provinciaService: ProvinciaService, 
      private route: ActivatedRoute,
      private router: Router,
    private administradorService: AdministradorService){
    }

    ngOnInit(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.empresaService.findById(id).subscribe({
      next: (data) => {
        this.empresa = data;
        this.empresaOriginal = JSON.parse(JSON.stringify(data));
        this.idProvincia = this.empresa.provincia?.id;
        this.idEmpresa = this.empresa.id ?? 0;

        if (this.empresa.provincia?.id) {
          this.provinciaService.findById(this.empresa.provincia.id).subscribe({
            next: (provincia) => {
              this.nombrePais = provincia.pais?.nombrePais ?? '';
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener empresa', error);
      }
    });
    
    this.rubroService.findAllActivos().subscribe({
      next: (data) => {
        this.rubros = data;
      },
      error: (error) => {
        console.error('Error al obtener rubros', error);
      }
    })
    }


    volver(): void {
      this.router.navigate(['/habilitaciones']);
    }

    habilitarEmpresa(): void {
    this.administradorService.habilitarEmpresa(this.idEmpresa).subscribe({
      next: () => {
        alert('Empresa habilitada con éxito');
        this.volver();
      },
      error: (error) => console.error('Error al habilitar empresa', error)
    });
  }

  rechazarEmpresa(): void {
    this.administradorService.rechazarEmpresa(this.idEmpresa).subscribe({
      next: () => {
        alert('Empresa rechazada');
        this.volver();
      },
      error: (error) => console.error('Error al rechazar empresa', error)
    });
  }
}
