import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-employee',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './header-employee.component.html',
  styleUrl: './header-employee.component.css'
})
export class HeaderEmployeeComponent {

  roleLogin: any;
  constructor(
    public router: Router,
    private _authService: AuthService
  ){
    this.roleLogin = AuthService.role == 1 ? "Admin" : AuthService.role == 2 ? "Manager": AuthService.role == 3 ? "Employee" : null;
  }

  solveDangXuat(){
    this._authService.dangXuat();
    this.router.navigate(['/login']);
  }

}
