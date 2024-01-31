import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ShiftsComponent } from './pages/shifts/shifts.component';
import { AddShiftComponent } from './pages/add-shift/add-shift.component';
import { EditShiftComponent } from './pages/edit-shift/edit-shift.component';
import { ProfileEditingComponent } from './pages/profile-editing/profile-editing.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UpcomingShiftComponent } from './components/upcoming-shift/upcoming-shift.component';
import { PastShiftsComponent } from './components/past-shifts/past-shifts.component';
import { ForgotPwdComponent } from './pages/forgot-pwd/forgot-pwd.component';
import { MonthNamePipe } from './pipes/month-name/month-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    ShiftsComponent,
    AddShiftComponent,
    EditShiftComponent,
    ProfileEditingComponent,
    NotFoundComponent,
    NavbarComponent,
    UpcomingShiftComponent,
    PastShiftsComponent,
    ForgotPwdComponent,
    MonthNamePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'angularproject-8ea8f',
        appId: '1:501312150845:web:fc6c2980ee562c6f43f954',
        storageBucket: 'angularproject-8ea8f.appspot.com',
        apiKey: 'AIzaSyBm4U5cvsOY0GWkn67UlBXFN1By0Mxy95Q',
        authDomain: 'angularproject-8ea8f.firebaseapp.com',
        messagingSenderId: '501312150845',
        measurementId: 'G-Z52HPK45RY',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
