import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile-editing',
  templateUrl: './profile-editing.component.html',
  styleUrls: ['./profile-editing.component.css'],
})
export class ProfileEditingComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  passwordSuccessMessage: boolean = false;
  passwordsNotMatch: boolean = false;
  passwordFormHasErrors = false;

  profileSuccessMessage: boolean = false;
  profileFormHasErrors: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
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

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/
          ),
        ],
      ],
      confirmNewPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userUID = this.authService.currentUser?.uid;
    if (userUID) {
      this.authService
        .getUserData(userUID)
        .then((userData) => {
          if (userData) {
            this.profileForm.patchValue(userData);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
    }
  }
  onSubmit() {
    if (this.profileForm.valid) {
      this.profileFormHasErrors = false;
      const updatedUserData = this.profileForm.value;
      const userUID = this.authService.currentUser?.uid;

      if (userUID) {
        this.authService
          .updateUserProfile(userUID, updatedUserData)
          .then(() => {
            this.profileSuccessMessage = true;
            setTimeout(() => {
              this.profileSuccessMessage = false;
            }, 2000);
          })
          .catch((error) => {
            console.error('Error updating user profile: ', error);
          });
      }
    } else {
      this.profileFormHasErrors = true;
    }
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      this.passwordFormHasErrors = false;
      const { currentPassword, newPassword, confirmNewPassword } =
        this.passwordForm.value;

      if (newPassword !== confirmNewPassword) {
        this.passwordsNotMatch = true;
        return;
      } else {
        this.passwordsNotMatch = false;
      }

      const user = this.authService.currentUser;

      if (user) {
        this.authService
          .updateUserPassword(user, currentPassword, newPassword)
          .then(() => {
            this.passwordSuccessMessage = true;
            setTimeout(() => {
              this.passwordSuccessMessage = false;
              this.passwordForm.reset();
            }, 2000);
            console.log('Password updated successfully');
          })
          .catch((error) => {
            console.error('Error updating password: ', error);
          });
      }
    } else {
      this.passwordFormHasErrors = true;
    }
  }
}
