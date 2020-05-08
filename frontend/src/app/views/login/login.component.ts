import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent { 
  
  loginUserData = {}
  constructor(private auth: AuthService, private router: Router) {}

  loginUser() {
    this.auth.loginUser(this.loginUserData).subscribe(data => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedUser", data.user);
      this.router.navigate(['/tours']);
      
      });
      
  }

}
