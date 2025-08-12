import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../empresa/empresa/empresa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from '../../../empresa/empresa/empresa';

@Component({
  selector: 'app-detalle-empresa',
  imports: [],
  templateUrl: './detalle-empresa.component.html',
  styleUrl: './detalle-empresa.component.css'
})
export class DetalleEmpresaComponent implements OnInit {
  empresa: Empresa = {};
  
  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('idEmpresa'));
    this.empresaService.findById(id).subscribe(data => {
      this.empresa = data;
    })
  }

  getSitioWebConProtocolo(url: string): string {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url;
    }
    return url;
  }

  volverAListado() {
    this.router.navigate([`buscar-empresas`]);
  }

}
