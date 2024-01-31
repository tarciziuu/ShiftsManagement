import { Injectable, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  User,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { UserInterface } from 'src/app/interfaces/user-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  createdUser?: User;
  currentUser?: User;
  userDisplayName: string = '';
  loggedUser = new Subject<boolean>();

  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.currentUser = user || undefined;
      if (user) {
        this.getUserDisplayName(user.uid);
      } else {
        this.userDisplayName = '';
      }
    });
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    age: number
  ) {
    try {
      const credentials = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await setDoc(doc(this.firestore, 'users', credentials.user.uid), {
        email: credentials.user.email,
        firstName: firstName,
        lastName: lastName,
        age: age,
      });

      this.createdUser = credentials.user;
      this.userDisplayName = firstName;

      return credentials.user;
    } catch (error) {
      console.error('Registration failed: ', error);
      throw new Error(`Invalid credentials.`);
    }
  }

  async login(email: string, password: string) {
    try {
      const credentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      this.loggedUser.next(true);
      this.currentUser = credentials.user;
      this.getUserDisplayName(credentials.user.uid);

      return credentials.user;
    } catch {
      throw new Error('Invalid credentials.');
    }
  }

  async logout() {
    await signOut(this.auth);
    this.loggedUser.next(false);
    this.currentUser = undefined;
    return;
  }

  async resetPwdEmail(email: string) {
    try {
      const credentials = await sendPasswordResetEmail(this.auth, email);
      alert('Password reset email sent!');

      return credentials;
    } catch (error) {
      console.error(error);
      throw new Error('Invalid credentials.');
    }
  }

  private async getUserDisplayName(userUID: string) {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userUID));
      const userData = userDoc.data();
      if (userData) {
        this.userDisplayName = userData['firstName'] || '';
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  }

  async getUserData(userUID: string): Promise<UserInterface | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userUID));
      const userData = userDoc.data();
      return userData as UserInterface;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async updateUserProfile(
    userUID: string,
    updatedUserData: Partial<UserInterface>
  ) {
    try {
      const { email } = updatedUserData;

      const userDocRef = doc(this.firestore, 'users', userUID);
      await updateDoc(userDocRef, updatedUserData);

      const user = this.auth.currentUser;

      if (user && email && email !== user.email) {
        await updateEmail(user, email);
      }

      this.userDisplayName = updatedUserData.firstName || '';
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile.');
    }
  }

  async updateUserPassword(
    user: User,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      if (!user.email) {
        throw new Error('User email is null or undefined');
      }
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (error) {
      throw new Error('Failed to update user password.');
    }
  }
}
