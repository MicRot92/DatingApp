import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../Types/user';
import { AccountService } from '../../../core/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    TextInput
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder)
  canceledRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected registerForm: FormGroup;;

  /**
   *
   */
  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')
      ]]
    });
    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }



  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { passwordMismatched: true };
    }
  }
  register() {
    console.log(this.registerForm.value);
    // this.accountService.register(this.creds).subscribe({
    //   next: (response: any) => {
    //     console.log('Registration successful:', response);
    //     this.cancel();
    //   },
    //   error: (error: any) => {
    //     console.error('Registration failed:', error);
    //   }
    // });
  }

  cancel() {
    console.log('Registration cancelled');
    // Implement cancellation logic here
    this.canceledRegister.emit(false);
  }
}
