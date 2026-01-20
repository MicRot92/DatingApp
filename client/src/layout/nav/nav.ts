import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected account = inject(AccountService);
  protected creds: any = {};

  login() {
    this.account.login(this.creds).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.account.login(this.creds);
        this.creds = {};
      },
      error: (error: any) => {
        console.error('Login failed:', error);
      }
    });
  }

  logout() {
    this.account.logout();
  }

}
