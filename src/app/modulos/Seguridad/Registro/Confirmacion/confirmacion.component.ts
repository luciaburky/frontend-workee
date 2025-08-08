import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  estado: 'verificando' | 'verificada' | 'error' | 'token-utilizado' = 'verificando';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

ngOnInit(): void {
  const token = this.route.snapshot.queryParamMap.get('token');

  if (token) {
    this.authService.confirmarcuenta(token).subscribe({
      next: (resp: string) => {
        if (resp === 'Cuenta verificada exitosamente') {
          this.estado = 'verificada';
        } else if (resp === 'El token ya fue utilizado') {
          this.estado = 'token-utilizado';
        } else {
          console.warn("Respuesta inesperada:", resp);
          this.estado = 'error';
        }
      },
      error: (err) => {
        console.error("Error al verificar cuenta", err);
        this.estado = 'error';
      }
    });
  } else {
    this.estado = 'error';
  }
}

}
