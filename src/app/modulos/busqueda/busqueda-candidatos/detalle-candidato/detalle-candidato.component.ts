import { Component, OnInit } from '@angular/core';
import { CandidatoService } from '../../../Candidato/candidato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidato } from '../../../Candidato/candidato';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-candidato',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalle-candidato.component.html',
  styleUrl: './detalle-candidato.component.css'
})
export class DetalleCandidatoComponent implements OnInit {
  candidato: Candidato = {};
  edadCandidato: number = 0;

  constructor(
    private candidatoService: CandidatoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idCandidato'));
    this.candidatoService.findById(id).subscribe(data => {
      this.candidato = data;
      this.edadCandidato = this.calcularEdad(this.candidato.fechaDeNacimiento!)
    })
  }

  volverAListado() {
    this.router.navigate([`buscar-candidatos`]);
  }

  calcularEdad(fechaNacimiento: Date | string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }
}
