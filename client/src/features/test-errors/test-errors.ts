import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {
  private http = inject(HttpClient);

  protected get404Error() {
    this.http.get('https://localhost:5001/api/buggy/not-found').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  protected get400Error() {
    this.http.get('https://localhost:5001/api/buggy/bad-request').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });

  }

  protected get500Error() {
    this.http.get('https://localhost:5001/api/buggy/server-error').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  protected get401Error() {
    this.http.get('https://localhost:5001/api/buggy/auth').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });


  }
}
