import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { BusyService } from '../../core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected account = inject(AccountService);
  protected busyService = inject(BusyService);
  private router = inject(Router)
  private toast = inject(ToastService);

  protected creds: any = {};
  login() {
    this.account.login(this.creds).subscribe({
      next: (response: any) => {
        this.router.navigateByUrl('/members');
        console.log('Login successful:', response);
        this.toast.success('Login successful');
        this.account.login(this.creds);
        this.creds = {};
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        this.toast.error('Login failed: ' + error.error);
        this.router.navigateByUrl('/');
      }
    });
  }

  logout() {
    this.account.logout();
    this.router.navigateByUrl('/');
  }


}
