import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponentComponent } from "./compartidos/SideBar/sidebar.component/sidebar.component.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-app';
}
