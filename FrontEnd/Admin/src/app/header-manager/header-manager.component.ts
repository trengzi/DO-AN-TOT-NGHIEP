import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-manager',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './header-manager.component.html',
  styleUrl: './header-manager.component.css'
})
export class HeaderManagerComponent {

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
