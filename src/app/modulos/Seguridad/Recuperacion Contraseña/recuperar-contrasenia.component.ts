import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  imports: [],
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrl: './recuperar-contrasenia.component.css'
})
export class RecuperarContraseniaComponent {
  // recuperarForm: FormGroup;
  submitForm: boolean = false;
  
  constructor(
    private router: Router
  ) {
   
  }

}

