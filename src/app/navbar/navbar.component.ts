import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { BbddService } from '../service/bbdd.service';
import { CommonUtilsService } from '../service/common-utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // Dependency Injection
  private bbddService = inject(BbddService);
  private commonUtilsService = inject(CommonUtilsService);
  private authService = inject(AuthService);

  // Form controls with validation
  passwordControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ],
  });

  confirmPasswordControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ],
  });

  emailControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.email,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ],
  });

  nameControl = new FormControl('', Validators.required);
  surnameControl = new FormControl('', Validators.required);

  // User information
  email: any;
  password: any;
  name: any;
  surname: any;
  user?: any;
  usuario: any;
  errPassC: boolean = false;
  errPass: boolean = false;
  err: string[] = [];
  existEmail: boolean = false;
  correctValidation: boolean = false;
  dropdownVisible = false;

  ngOnInit() {
    // Check if user is logged in
    this.authService.getUser().then((user: any) => {
      if (user) {
        this.bbddService.getUsuarioOnlyByEmail(user.data?.identities[0].email).subscribe((data: any) => {
          this.commonUtilsService.setUsuario(data[0]);
          this.usuario = data[0];
        });
      }
    });
  }

// Method to handle sign-up
signup($event: Event) {
  $event.preventDefault();
  this.limpiarLista();

  // Validate password length
  if (!this.passwordControl.valid) {
    this.errPassC = true;
    this.err.push("Password must be between 6 and 15 characters");
  }

  // Check if other fields are valid
  if (this.emailControl.valid && this.nameControl.valid && this.surnameControl.valid) {
    this.name = this.nameControl.value;
    this.surname = this.surnameControl.value;
    this.email = this.emailControl.value;
    this.password = this.passwordControl.value;

    // Check if passwords match
    if (this.password !== this.confirmPasswordControl.value) {
      this.err.push("Passwords don't match");
      return;
    } else {
      // Sign up the user
      this.bbddService.signUp(this.name, this.surname, this.email, this.password).subscribe({
        next: (data: any) => {
          if (data) {
            this.authService.signUp(data[0].email, data[0].password).then((data: any) => {
              console.log(data);
            });
            console.log(data);
          }
        },
        error: (error) => {
          this.err.push("Email already registered");
        },
      });
    }
  } else {
    this.err.push("All fields are required");
  }
}

// Method to handle login
getUserByEmail($event: Event) {
  this.limpiarLista();
  this.email = this.emailControl.value;
  this.password = this.passwordControl.value;

  this.bbddService.getUserByEmail(this.email, this.password).subscribe({
    next: (data: any) => {
      if (data) {
        this.user = data[0];
        this.authService.login(data[0].email, data[0].password).then((data: any) => {
          window.location.href = '/home';
        });
        this.correctValidation = true;
      }
    },
    error: (error) => {
      this.correctValidation = false;
      this.err.push("Incorrect email or password");
    },
  });
}

// Method to check if email exists
existeEmail(event: Event) {
  this.existEmail = false;
  this.email = (event.target as HTMLInputElement).value;

  this.bbddService.existEmail(this.email).subscribe({
    next: (data: any) => {
      if (data.length > 0) {
        this.existEmail = true;
      }
    },
    error: (error) => {
      console.error(error);
    },
  });
}

// Clear error list
limpiarLista() {
  this.err = [];
}

// Toggle dropdown menu visibility
toggleDropdown() {
  this.dropdownVisible = !this.dropdownVisible;
}

// Logout the user
logout() {
  this.authService.logout().then(() => {
    window.location.href = '/';
  });
}

// Show verification alert
swal() {
  Swal.fire({
    title: 'Verify your account',
    background: '#111827',
    text: "You must verify your account in your email!",
    color: 'white',
    icon: 'warning',
  });
}

// Show delete confirmation alert and handle deletion
swalDelete() {
  Swal.fire({
    title: 'Are you sure?',
    background: '#111827',
    text: "You won't be able to revert this!",
    color: 'white',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.bbddService.deleteAllPokemonsFromTeam(this.usuario.idUser).subscribe(() => {
        this.deleteUser(this.usuario.idUser);
        this.logout();
      });
    }
  });
}

// Validate errors and close modal if no errors
validateErr() {
  if (this.err.length == 0) {
    this.swal();
    (document.getElementById('my_modal') as HTMLDialogElement).close();
  }
}

// Validate password match
validatePass() {
  this.errPassC = this.confirmPasswordControl.value != this.passwordControl.value;
}

// Validate password control
validatePass2() {
  this.errPass = this.passwordControl.invalid;
}

// Delete user
deleteUser(id: number) {
  this.bbddService.deleteUser(id).subscribe({
    next: (data: any) => {
      console.log(data);
    },
    error: (error) => {
      console.error(error);
    },
  });
}
}