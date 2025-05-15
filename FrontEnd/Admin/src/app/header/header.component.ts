import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  roleLogin: any;
  constructor(
    public router: Router,
    private _authService: AuthService
  ){
    this.roleLogin = AuthService.role == 1 ? "Admin" : AuthService.role == 2 ? "Manager": AuthService.role == 3 ? "Employee" : null;
    this.roleLogin = this.roleLogin.toLowerCase();
  }

  solveDangXuat(){
    this._authService.dangXuat();
    this.router.navigate(['/login']);
  }

}
