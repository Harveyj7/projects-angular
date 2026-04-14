import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  // const router = inject(Router);
  // router.navigate(['/login']); // or wherever you want to redirect
  return authService.currentUser() ? true : false;
};
