import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css'],
})
export class ForgotPwdComponent {
  email: string = '';
  constructor(private authService: AuthService) {}
  onSubmit() {
    this.authService
      .resetPwdEmail(this.email)
      .then((credentials) => {
        console.log('Password reset successful:', credentials);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}
