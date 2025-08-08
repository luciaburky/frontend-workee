import { Component, OnInit } from '@angular/core';
import { CandidatoService } from '../../../Candidato/candidato.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidato } from '../../../Candidato/candidato';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-candidato',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detalle-candidato.component.html',
  styleUrl: './detalle-candidato.component.css'
})
export class DetalleCandidatoComponent implements OnInit {
  candidato: Candidato = {};
  edadCandidato: number = 0;
  dropdownAbierto: boolean = false;
  // ofertas: Oferta[] = []
  
  // ARRAY USADO PARA MOSTRAR LAS OFERTAS QUE SE PUEDEN ENVIAR AL CANDIDATO
  ofertas: string[] = [
    'Desarrollador Backend Senior',
    'Diseñador UX/UI',
    'Analista Funcional',
    'Tester QA Ssr.',
  ];

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

  abrirDesplegable() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  enviarOferta(oferta: string) {
    Swal.fire({
      title: `¿Está seguro de enviar la oferta "${oferta}"?`,
      icon: "question",
      iconColor: "#31A5DD",
      showCancelButton: true,
      confirmButtonColor: "#31A5DD",
      cancelButtonColor: "#697077",
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "No, volver",
      reverseButtons: true,
      customClass: {
        title: 'titulo-chico',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // logica para enviar la oferta al candidato...
        // dejo el swal para confirmar el envio de la oferta al candidato
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "La oferta se envió correctamente al candidato",
          timer: 3000,
          showConfirmButton: false,
        })
        // error en el caso de que el candidato ya este
        // Swal.fire({
        //   toast: true,
        //   position: "top-end",
        //   icon: "warning",
        //   title: "No puede enviar esta oferta porque el candidato ya está postulado",
        //   timer: 3000,
        //   showConfirmButton: false,
        // })

    }});
  }
}
