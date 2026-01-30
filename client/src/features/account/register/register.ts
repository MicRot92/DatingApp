import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../Types/user';
import { AccountService } from '../../../core/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";
import { count } from 'rxjs';
import { Router } from '@angular/router';

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
  private router = inject(Router);
  private fb = inject(FormBuilder)
  canceledRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected credentialsForm: FormGroup;
  protected profileForm!: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);
  /**
   *
   */
  constructor() {
    this.credentialsForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmPassword: ['', [
        Validators.required,
        this.matchValues('password')
      ]]
    });
    this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
      this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.profileForm = this.fb.group({
      dateOfBirth: [''],
      city: [''],
      gender: [''],
      country: ['']
    });

  }



  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { passwordMismatched: true };
    }
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

  prevStep() {
    this.currentStep.update(prevStep => prevStep - 1);
  }

  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    if (this.credentialsForm.valid && this.profileForm.valid) {
      const credentials = this.credentialsForm.value;
      const profile = this.profileForm.value;

      const formData: RegisterCreds = {
        displayName: credentials.displayName,
        email: credentials.email,
        password: credentials.password,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        city: profile.city,
        country: profile.country
      };
      console.log('Registering user with data:', formData);

      this.accountService.register(formData).subscribe({
        next: (response: any) => {
          console.log('Registration successful:', response);
          this.router.navigateByUrl('/members');
          this.cancel();
        },
        error: (error: any) => {
          console.error('Registration failed:', error);
          this.validationErrors.set(error);
        }
      });
    }

  }

  cancel() {
    console.log('Registration cancelled');
    // Implement cancellation logic here
    this.canceledRegister.emit(false);
  }
}
