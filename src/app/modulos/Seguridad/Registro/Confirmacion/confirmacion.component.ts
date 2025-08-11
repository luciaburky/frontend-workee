import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  estado: 'exito' | 'usado' | 'error' | 'verificando' = 'verificando';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.confirmarcuenta(token).subscribe({
        next: (res) => {
          if (res.estado === 'habilitado') {
            this.estado = 'exito';
          } else {
            this.estado = 'error';
          }
        },
        error: () => {
          this.estado = 'error';
        }
      });
    } else {
      this.estado = 'error';
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../auth.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-confirmacion',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './confirmacion.component.html',
//   styleUrls: ['./confirmacion.component.css']
// })
// export class ConfirmacionComponent implements OnInit {

//   estado: 'exito' | 'usado' | 'error' | 'verificando' = 'verificando';

//   constructor(
//     private route: ActivatedRoute,
//     private authService: AuthService
//   ) {}

  // ngOnInit() {
  //   const token = this.route.snapshot.queryParamMap.get('token');
  //   if (token) {
  //     this.authService.confirmarCuenta(token).subscribe({
  //       next: (res) => {
  //         if (res.estado === 'habilitado') {
  //           this.estado = 'exito';
  //         } else {
  //           this.estado = 'error';
  //         }
  //       },
  //       error: () => {
  //         this.estado = 'error';
  //       }
  //     });
  //   } else {
  //     this.estado = 'error';
  //   }
  // }
// }

