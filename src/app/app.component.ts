import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  authState: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loggedUser.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.authState = true;
      } else {
        this.authState = false;
      }
    });
  }
}
