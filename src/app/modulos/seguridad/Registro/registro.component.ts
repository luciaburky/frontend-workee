import { Component } from '@angular/core';
import { RegistroEmpresaComponent } from "./Registro Empresa/registro-empresa.component";
import { CommonModule } from '@angular/common';
import { RegistroCandidatoComponent } from "./Registro Candidato/registro-candidato.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    RegistroEmpresaComponent,
    RegistroCandidatoComponent
],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  modo: 'candidato' | 'empresa' = 'candidato';
}
