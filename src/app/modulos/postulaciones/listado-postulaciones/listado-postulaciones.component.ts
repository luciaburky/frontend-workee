import { Component, OnInit } from '@angular/core';
import { Candidato } from '../../candidato/candidato';
import { UsuarioService } from '../../seguridad/usuarios/usuario.service';
import { MultiSelect } from 'primeng/multiselect';
import { PostulacionService } from '../postulacion.service';
import { PostulacionSimplificadaDTO } from '../postulacion-simplificada-dto';
import { SpinnerComponent } from '../../../compartidos/spinner/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { OfertaService } from '../../oferta/oferta.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listado-postulaciones',
  imports: [CommonModule, MultiSelect, SpinnerComponent],
  templateUrl: './listado-postulaciones.component.html',
  styleUrl: './listado-postulaciones.component.css'
})
export class ListadoPostulacionesComponent implements OnInit {
  
  candidato?: Candidato;
  idCandidato!: number;

  postulaciones: any[] = [];
  
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  isLoading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private postulacionService: PostulacionService,
    private ofertaService: OfertaService,
  ) {}

  ngOnInit() {
    this.usuarioService.getUsuario().subscribe(data => {
      this.candidato = data;
      this.idCandidato = this.candidato.id!;
      this.postulacionService.getPostulaciones(this.idCandidato).subscribe(post => {
        const requests = post.map((p: any) => this.ofertaService.getOferta(p.idOferta));
        
        forkJoin(requests).subscribe(ofertas => {
          this.postulaciones = post.map((p: any, index: number) => {
            const oferta = ofertas[index];
            const etapaActual = p.etapas.find((e: any) => e.fechaHoraBaja === null);
            return {
              ...p,
              oferta,
              etapaActual: etapaActual?.etapa
            };
          });
          this.isLoading = false;
          console.log("Postulaciones enriquecidas:", this.postulaciones);
        });
      });
    });
  }
 

  verDetalles(idPostulacion: number) {}

  // Para paginacion
  get totalPaginas(): number {
    return Math.ceil(this.postulaciones.length / this.elementosPorPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerPostPaginadas(): PostulacionSimplificadaDTO[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.postulaciones.slice(inicio, fin);
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
  
  get paginasMostradas(): (number | string)[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const paginas: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        paginas.push(i);
      }
    } else {
      paginas.push(1);

      if (actual > 3) {
        paginas.push('...');
      }

      const start = Math.max(2, actual - 1);
      const end = Math.min(total - 1, actual + 1);

      for (let i = start; i <= end; i++) {
        paginas.push(i);
      }

      if (actual < total - 2) {
        paginas.push('...');
      }

      paginas.push(total);
    }

    return paginas;
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }


}
