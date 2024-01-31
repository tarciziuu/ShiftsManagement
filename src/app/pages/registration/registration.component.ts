import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registerForm: FormGroup;
  passwordsNotMatch: boolean = false;
  successMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(2)]],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/
          ),
        ],
      ],
      confirmPwd: ['', Validators.required],
      age: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.min(18),
          Validators.max(130),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.error('Form is invalid');
      return;
    }
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const confirmPwd = this.registerForm.get('confirmPwd')?.value;
    const firstName = this.registerForm.get('fname')?.value;
    const lastName = this.registerForm.get('lname')?.value;
    const age = this.registerForm.get('age')?.value;

    if (password !== confirmPwd) {
      this.passwordsNotMatch = true;
      return;
    } else {
      this.passwordsNotMatch = false;
    }

    this.authService
      .register(email, password, firstName, lastName, age)
      .then(() => {
        this.successMessage = true;
        setTimeout(() => {
          this.successMessage = false;
          this.router.navigate(['/login']);
        }, 3000);
      })
      .catch((error) => {
        console.error('Registration failed: ', error);
      });
  }
}
