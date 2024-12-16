// src/app/components/login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = new User();

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user).subscribe(response => {
      localStorage.setItem('token', response.token);
      this.router.navigate(['/profile']);
    }, error => {
      console.log(error);
    });
  }
}
