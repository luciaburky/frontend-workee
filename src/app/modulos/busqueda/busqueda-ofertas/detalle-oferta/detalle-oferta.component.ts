import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Oferta } from '../../../oferta/oferta';
import { DatePipe } from '@angular/common';
import { SesionService } from '../../../../interceptors/sesion.service';
import { Rol } from '../../../seguridad/rol';
import { OfertaService } from '../../../oferta/oferta.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-oferta',
  imports: [DatePipe, RouterLink],
  templateUrl: './detalle-oferta.component.html',
  styleUrl: './detalle-oferta.component.css'
})
export class DetalleOfertaComponent implements OnInit {
  
  oferta!: Oferta;
  esCandidato: boolean = false;
  rolUsuario: Rol = {};

  origen: any | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ofertaService: OfertaService,
    private sesionService: SesionService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('idOferta'));
    this.ofertaService.getOferta(id).subscribe(data => {
      this.oferta = data;
      // this.edadCandidato = this.calcularEdad(this.candidato.fechaDeNacimiento!)
    })

    const rol = this.sesionService.getRolActual();
    this.rolUsuario = rol ? rol : {};
    console.log(this.rolUsuario);

    if (this.rolUsuario.codigoRol === 'CANDIDATO') {
      this.esCandidato = true;
    }

    const origen = this.route.snapshot.queryParamMap.get('from');
    this.origen = origen; // guardar para usar en volverAListado()
  }

  volver() {
    if (this.origen === 'empresa') {
      this.router.navigate([`buscar-empresas/detalle`, this.oferta.empresa.id]);
    } else {
      this.router.navigate([`buscar-ofertas`]);
    }
  }

}
