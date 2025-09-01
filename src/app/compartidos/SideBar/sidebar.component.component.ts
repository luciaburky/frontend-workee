import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar.component',
  imports: [],
  templateUrl: './sidebar.component.component.html',
  styleUrl: './sidebar.component.component.css'
})
export class SidebarComponent implements OnInit{

  menuItems?: any[];

  constructor(
    private sideBarService : SidebarService,
    private router: Router
  ){
    this.menuItems = this.sideBarService.menu;
  }

  ngOnInit(): void {
    //this.rol = sessionStorage.getItem
      
  }
}
