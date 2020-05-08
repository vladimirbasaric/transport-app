import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
   
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if(this.authService.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

  }  
}
