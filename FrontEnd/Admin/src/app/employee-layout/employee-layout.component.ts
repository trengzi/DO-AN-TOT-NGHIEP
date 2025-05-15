import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderEmployeeComponent } from "../header-employee/header-employee.component";

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderEmployeeComponent
],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})
export class EmployeeLayoutComponent {

}
