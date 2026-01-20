import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds, User } from '../../../Types/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  cancledRegister = output<boolean>();
  protected creds = {} as RegisterCreds;

  register() {
    console.log('Registering user with credentials:', this.creds);
    // Implement registration logic here
  }

  cancel() {
    console.log('Registration cancelled');
    // Implement cancellation logic here
    this.cancledRegister.emit(false);
  }
}
