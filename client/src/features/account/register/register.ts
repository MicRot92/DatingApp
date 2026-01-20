import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../Types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  cancledRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

  register() {
    this.accountService.register(this.creds).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.cancel();
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
      }
    });
  }

  cancel() {
    console.log('Registration cancelled');
    // Implement cancellation logic here
    this.cancledRegister.emit(false);
  }
}
