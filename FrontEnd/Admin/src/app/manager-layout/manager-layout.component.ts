import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderManagerComponent } from "../header-manager/header-manager.component";

@Component({
  selector: 'app-manager-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderManagerComponent
],
  templateUrl: './manager-layout.component.html',
  styleUrl: './manager-layout.component.css'
})
export class ManagerLayoutComponent {

}
