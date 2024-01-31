import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { AddShiftComponent } from './pages/add-shift/add-shift.component';
import { ProfileEditingComponent } from './pages/profile-editing/profile-editing.component';
import { EditShiftComponent } from './pages/edit-shift/edit-shift.component';
import { ForgotPwdComponent } from './pages/forgot-pwd/forgot-pwd.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPwdComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'my-shifts', component: ShiftsComponent, canActivate: [authGuard] },
  { path: 'add-shift', component: AddShiftComponent, canActivate: [authGuard] },
  {
    path: 'edit-shift/:id',
    component: EditShiftComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileEditingComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
