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
      Validators.minLength(8),
      Validators.maxLength(15),
      Validators.pattern(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[$@$!%?&])([A-Za-z\d$@$!%?&]|[^ ]){8,15}$/),
    ]
  });
  emailControl = new FormControl('', Validators.required);
  nameControl = new FormControl('', Validators.required);
  surnameControl = new FormControl('', Validators.required);

  email: any;
  password: any;
  name: any;
  surname: any;

  private authService = inject(AuthService);
  login($event: Event) {

    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;

    this.authService.login(this.email, this.password).then((data: any) => {
      console.log(data);
    });
  }

  signup($event: Event) {
    if(this.passwordControl.valid && this.emailControl.valid && this.nameControl.valid && this.surnameControl.valid){
      this.email = this.emailControl.value;
      this.password = this.passwordControl.value;
      this.name = this.nameControl.value;
      this.surname = this.surnameControl.value;

      this.bbddService
        .signUp(this.email, this.password, this.name, this.surname)
        .subscribe({
          next: (data) => {
            if (data) {
              console.log(data);
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
      }else{
        console.log("error de validacion");
      }
  }
}
