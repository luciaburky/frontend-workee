import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedaService } from '../../busqueda.service';
import { Oferta } from '../../../oferta/oferta';
import { DatePipe } from '@angular/common';
import { SesionService } from '../../../../interceptors/sesion.service';
import { Rol } from '../../../seguridad/rol';

@Component({
  selector: 'app-detalle-oferta',
  imports: [DatePipe],
  templateUrl: './detalle-oferta.component.html',
  styleUrl: './detalle-oferta.component.css'
})
export class DetalleOfertaComponent implements OnInit {
  
  oferta!: Oferta;
  esCandidato: boolean = false;
  rolUsuario: Rol = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private busService: BusquedaService,
    private sesionService: SesionService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('idOferta'));
    this.busService.oferta(id).subscribe(data => {
      this.oferta = data;
      // this.edadCandidato = this.calcularEdad(this.candidato.fechaDeNacimiento!)
    })

    const rol = this.sesionService.getRolActual();
    this.rolUsuario = rol ? rol : {};
    console.log(this.rolUsuario);

    if (this.rolUsuario.codigoRol === 'CANDIDATO') {
      this.esCandidato = true;
    }
  }

  volverAListado() {
    this.router.navigate([`buscar-candidatos`]);
  }

}
