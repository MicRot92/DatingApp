import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../Types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);

  baseUrl = environment.apiUrl;

  register(creds: RegisterCreds) {
    console.log('AccountService register called with creds:', creds);
    return this.http.post<User>(this.baseUrl + 'account/register', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
        console.log('User registered:', user);
      })
    );
  }

  login(creds: LoginCreds) {
    console.log('AccountService login called with creds:', creds);
    return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
      tap((user) => {
        if (user) {
          this.setCurrentUser(user);
          console.log('UserPhoto', user.photoUrl);
        }
        console.log('User logged in X:', user);
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    console.log('current user in accountservice: ', this.currentUser()?.displayName)
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.currentUser.set(null);
  }


}
