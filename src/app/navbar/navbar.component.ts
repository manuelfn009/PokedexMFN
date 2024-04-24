import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  passwordControl = new FormControl('', Validators.required);
  emailControl = new FormControl('', Validators.required);
  
  email: any;
  password: any;

  private authService = inject(AuthService);
  login($event: Event) {
    $event.preventDefault();

    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;

    this.authService.login(this.email, this.password)
    .then((data:any) => {
      console.log(data);
    })
  }
}
