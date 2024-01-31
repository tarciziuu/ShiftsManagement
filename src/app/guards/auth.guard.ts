import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).currentUser !== undefined;

  if (isLoggedIn) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['']);
    return false;
  }
};
