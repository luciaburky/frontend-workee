import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../../../compartidos/modal/modal.service';
import { HabilidadService } from '../../../../admin/ABMHabilidad/habilidad.service';
import { TipoHabilidadService } from '../../../../admin/ABMTipoHabilidad/tipo-habilidad.service';
import { Habilidad } from '../../../../admin/ABMHabilidad/habilidad';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoHabilidad } from '../../../../admin/ABMTipoHabilidad/tipo-habilidad';

@Component({
  selector: 'app-seleccion-habilidades',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seleccion-habilidades.component.html',
  styleUrl: './seleccion-habilidades.component.css'
})
export class SeleccionHabilidadesComponent implements OnInit {
  
  habilidadList: Habilidad[] = []; // lista de habilidades filtrada segun la busqueda
  habilidadListOriginal: Habilidad[] = []; // lista de habilidades completa, sin filtrar
  @Input() habilidadesSeleccionadas: Habilidad[] = [];
  tipoHabilidadList: TipoHabilidad[] = []; // lista de tipos de habilidad
  
  tipoSeleccionado!: TipoHabilidad;
  modalRef?: NgbModalRef;
  filtro: string = '';
  
  constructor(
    private modalService: ModalService,
    private habilidadService: HabilidadService,
    private tipoHabilidadService: TipoHabilidadService
  ) {}


  ngOnInit(): void {
    console.log(this.habilidadesSeleccionadas)
    this.habilidadService.findAllActivas().subscribe(habilidades => {
      this.habilidadListOriginal = habilidades;
      this.habilidadList = [...habilidades];

      if (this.tipoSeleccionado) {
        this.habilidadList = this.habilidadListOriginal.filter(h =>
          h.tipoHabilidad?.id === this.tipoSeleccionado.id
        );
      };
    });

    this.tipoHabilidadService.findAllActivos().subscribe(tiposHabilidades => {
      this.tipoHabilidadList = tiposHabilidades;
      this.habilidadesSeleccionadas.forEach(hab => {
        const tipoEncontrado = this.tipoHabilidadList.find(t => t.id === hab.tipoHabilidad?.id);
        if (tipoEncontrado) {
          hab.tipoHabilidad = tipoEncontrado;
        }
      });
      if (tiposHabilidades.length > 0) {
        this.tipoSeleccionado = tiposHabilidades[0];
        this.seleccionarTipo(this.tipoSeleccionado);
      }
    })
  }

  // Buscar habilidades dentro del listado
  buscarHabilidades() {
    const texto = this.filtro.trim().toLowerCase();

    this.habilidadList = this.habilidadListOriginal.filter(h =>
      (!this.tipoSeleccionado || h.tipoHabilidad?.id === this.tipoSeleccionado.id) &&
      (texto === '' || h.nombreHabilidad?.toLowerCase().includes(texto))
    );
  }

  seleccionarTipo(tipo: TipoHabilidad) {
    this.tipoSeleccionado = tipo;
    this.habilidadList = this.habilidadListOriginal.filter(h =>
      h.tipoHabilidad?.id === tipo.id
    );
  }

  estaSeleccionada(hab: Habilidad): boolean {
    return this.habilidadesSeleccionadas.some(h => h.id === hab.id);
  }

  toggleHabilidad(hab: Habilidad) {
    if (this.estaSeleccionada(hab)) {
      this.habilidadesSeleccionadas = this.habilidadesSeleccionadas.filter(
        h => h.id !== hab.id);
    } else {
      this.habilidadesSeleccionadas.push(hab);
    }
  }

  habilidadesSeleccionadasPorTipo(tipo: TipoHabilidad): Habilidad[] {
    console.log("entre al habilidades selecc por tipo")
    return this.habilidadesSeleccionadas.filter(h => h.tipoHabilidad?.id === tipo.id);
  }

  quitarHabilidad(hab: Habilidad) {
    this.habilidadesSeleccionadas = this.habilidadesSeleccionadas.filter(
      h => h.id !== hab.id);
  }

  dismissModal() {
    this.modalService.dismissActiveModal();
  }

}
