import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardEmployee implements CanActivate {

  role = 0;
  constructor(
    private router: Router,
  ) {}

  canActivate(): boolean {

    const storedValue = localStorage.getItem('isLoggedInAdmin');
    const storedRole = localStorage.getItem('roleAdmin');
    this.role = storedRole ? parseInt(storedRole, 10) : 0;
    if (!storedValue || this.role != 3) {

      return false;
    }
    return true;
  }
}
