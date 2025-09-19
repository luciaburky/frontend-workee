// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { BackupService } from './backup.service';
// import Swal from 'sweetalert2';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-backup',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './backup.component.html',
//   styleUrl: './backup.component.css'
// })
// export class BackupComponent implements OnInit {

//   listadoBackups: string[] = []; 
//   selectedBackup: string = '';

//   constructor(
//     private router: Router,
//     private backupService: BackupService,
//   ) {}

//   ngOnInit(): void {
//     this.backupService.listarBackups().subscribe({
//       next: (data: string[]) => {           
//         this.listadoBackups = data;
//       },
//       error: (error: unknown) => {           
//         console.error('Error al listar backups', error);
//       }
//     });
//   }

//   generarBakcup() {
//     this.backupService.generarBackup().subscribe({
//       next: (_resp: any) => {
//         alert("Backup generado correctamente");
//         this.backupService.listarBackups().subscribe({
//           next: (data: string[]) => this.listadoBackups = data
//         });
//       },
//       error: (error: unknown) => {
//         console.error(error);
//         alert("Error al generar el backup");
//       }
//     });
//   }

//   restaurarBackup(nombreBackup: string) {
//   if (!nombreBackup) {
//     Swal.fire('Atención', 'Debe seleccionar un backup primero.', 'warning');
//     return;
//   }

//   Swal.fire({
//     title: '¿Estás seguro?',
//     text: `Se restaurará el backup: ${nombreBackup}. Esta acción no se puede deshacer.`,
//     icon: 'warning',
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Sí, restaurar',
//     cancelButtonText: 'Cancelar'
//   }).then((result) => {
//     if (result.isConfirmed) {
//       this.backupService.restaurarBackup(nombreBackup).subscribe({
//         next: () => {
//           Swal.fire('Restaurado', `El backup ${nombreBackup} se restauró correctamente.`, 'success');
//         },
//         error: () => {
//           Swal.fire('Error', 'Ocurrió un error al restaurar el backup.', 'error');
//         }
//       });
//     }
//   });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackupService } from './backup.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit {

  listadoBackups: string[] = [];
  selectedBackup: string = '';

  constructor(
    private router: Router,
    private backupService: BackupService,
  ) {}

  ngOnInit(): void {
    this.cargarListado();
  }

  private cargarListado(): void {
    this.backupService.listarBackups().subscribe({
      next: (data: string[]) => { this.listadoBackups = data; },
      error: (error: unknown) => {
        console.error('Error al listar backups', error);
        this.swalErrorGenerico('No se pudo obtener el listado de backups.');
      }
    });
  }

  // =============== BACKUP ===============
  generarBakcup(): void {
    // Pop Up Confirmación Backup
    Swal.fire({
      html: `
        <div class="swal-icon-circle info">
          <span class="material-symbols-outlined">download</span>
        </div>
        <h3 class="swal-headline">¿Está seguro que desea realizar un backup?</h3>
      `,
      showCancelButton: true,
      reverseButtons: true,
      focusConfirm: false,
      confirmButtonText: 'Sí, realizar',
      cancelButtonText: 'No, cancelar',
      customClass: {
        popup: 'swal-card',
        htmlContainer: 'swal-text-center',
        confirmButton: 'swal-btn-primary',
        cancelButton: 'swal-btn-secondary',
        actions: 'swal-actions-row'
      }
    }).then(res => {
      if (!res.isConfirmed) { return; }

      // Llamada al servicio
      this.backupService.generarBackup().subscribe({
        next: () => {
          // Mensaje de éxito: Backup
          Swal.fire({
            icon: 'success',
            title: 'Backup realizado correctamente',
            html: 'La copia de seguridad fue creada y almacenada con éxito.',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'swal-card',
              htmlContainer: 'swal-text-center',
              confirmButton: 'swal-btn-success'
            }
          });
          this.cargarListado();
        },
        // Error Backup
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo completar el backup',
            html: 'Ocurrió un problema durante el proceso de copia de seguridad.<br>Por favor, inténtelo nuevamente.',
            showCloseButton: true,
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'swal-card',
              htmlContainer: 'swal-text-center',
              confirmButton: 'swal-btn-primary',
              closeButton: 'swal-close'
            }
          });
        }
      });
    });
  }

  // =============== RESTAURACIÓN ===============
  restaurarBackup(nombreBackup: string): void {
    if (!nombreBackup) {
      // Warning: no seleccionó backup
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un backup primero.',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'swal-card',
          confirmButton: 'swal-btn-primary'
        }
      });
      return;
    }

    // Pop Up Confirmación Restauración
    Swal.fire({
      html: `
        <div class="swal-icon-circle info">
          <span class="material-symbols-outlined">sync</span>
        </div>
        <h3 class="swal-headline">¿Está seguro que desea realizar la restauración?</h3>
        <div class="swal-sub">Esta acción reemplazará los datos actuales.</div>
      `,
      showCancelButton: true,
      reverseButtons: true,
      focusConfirm: false,
      confirmButtonText: 'Sí, realizar',
      cancelButtonText: 'No, cancelar',
      customClass: {
        popup: 'swal-card',
        htmlContainer: 'swal-text-center',
        confirmButton: 'swal-btn-primary',
        cancelButton: 'swal-btn-secondary',
        actions: 'swal-actions-row'
      }
    }).then(res => {
      if (!res.isConfirmed) { return; }

      this.backupService.restaurarBackup(nombreBackup).subscribe({
        next: () => {
          // Mensaje de éxito: Restauración
          Swal.fire({
            icon: 'success',
            title: 'Restauración realizada correctamente',
            html: 'La restauración se realizó con éxito.',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'swal-card',
              htmlContainer: 'swal-text-center',
              confirmButton: 'swal-btn-success'
            }
          });
          this.cargarListado();
        },
        // Error Restauración
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo completar la restauración',
            html: 'Ocurrió un problema durante el proceso de restauración de datos.<br>Por favor, inténtelo nuevamente.',
            showCloseButton: true,
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'swal-card',
              htmlContainer: 'swal-text-center',
              confirmButton: 'swal-btn-primary',
              closeButton: 'swal-close'
            }
          });
        }
      });
    });
  }

  // Reutilizable para errores genéricos
  private swalErrorGenerico(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Ups…',
      text: mensaje,
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'swal-card',
        confirmButton: 'swal-btn-primary'
      }
    });
  }
}

