import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardLoginPage implements CanActivate {

  isDangNhap = false;
  constructor(
    private router: Router,
  ) {}

  canActivate(): boolean {
    const storedValue = localStorage.getItem('isLoggedInAdmin');

    if (storedValue) {

      return false;
    }
    return true;
  }
}
