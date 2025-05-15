import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  role = 0;
  constructor(
  ) {}

  canActivate(): boolean{

      if(AuthService.isDangNhap)
      {
        return true;
      }
      return false;
  }
}
