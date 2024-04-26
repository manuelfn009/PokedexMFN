import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { BbddService } from '../service/bbdd.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private bbddService = inject(BbddService);

  passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ],
  });
  emailControl = new FormControl('', Validators.required);
  nameControl = new FormControl('', Validators.required);
  surnameControl = new FormControl('', Validators.required);

  email: any;
  password: any;
  name: any;
  surname: any;
  user?: any;

  correctValidation: boolean = false;

  private authService = inject(AuthService);
  login($event: Event) {}

  signup($event: Event) {
    $event.preventDefault();
    if (
      this.passwordControl.valid &&
      this.emailControl.valid &&
      this.nameControl.valid &&
      this.surnameControl.valid
    ) {
      this.name = this.nameControl.value;
      this.surname = this.surnameControl.value;
      this.email = this.emailControl.value;
      this.password = this.passwordControl.value;

      this.bbddService
        .signUp(this.name, this.surname, this.email, this.password)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.authService
                .signUp(data[0].email, data[0].password)
                .then((data: any) => {
                  console.log(data);
                });
              console.log(data);
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      console.log('error de validacion');
    }
  }

  getUserByEmail($event: Event) {
    //$event.preventDefault();

    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;

    this.bbddService.getUserByEmail(this.email, this.password).subscribe({
      next: (data: any) => {
        if (data) {
          this.user = data[0];
          this.authService
            .login(data[0].email, data[0].password)
            .then((data: any) => {
              console.log(data);
            });
          this.correctValidation = true;
          console.log(data);
        }
      },
      error: (error) => {
        this.correctValidation = false;
        console.log(error);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
