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
  private bbddService = inject(BbddService);
  private commonUtilsService = inject(CommonUtilsService);

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
  })
  emailControl = new FormControl('', Validators.required);
  nameControl = new FormControl('', Validators.required);
  surnameControl = new FormControl('', Validators.required);

  email: any;
  password: any;
  name: any;
  surname: any;
  user?: any;
  usuario: any;
  err: string[] = [];
  existEmail: boolean = false; 

  supabase = inject(BbddService);

  ngOnInit() {
    console.log("El usuario es",this.authService.getUser());
    this.authService.getUser().then((user: any) => {
      console.log("El usuario es",user);
      if(user){
        this.supabase.getUsuarioOnlyByEmail(user.data?.identities[0].email).subscribe((data: any) => {
          this.commonUtilsService.setUsuario(data[0]);
          this.usuario = data[0];
        });
      };
    });
  }

  correctValidation: boolean = false;

  private authService = inject(AuthService);
  login($event: Event) {}

  signup($event: Event) {
    $event.preventDefault();    
    this.limpiarLista();

    if (!this.passwordControl.valid){
      this.limpiarLista();
      this.err.push("Password must have between 6 and 15 characters");
    }

    if (
      this.emailControl.valid &&
      this.nameControl.valid &&
      this.surnameControl.valid
    ) {
      this.name = this.nameControl.value;
      this.surname = this.surnameControl.value;
      this.email = this.emailControl.value;
      this.password = this.passwordControl.value;

      if (this.password !== this.confirmPasswordControl.value) {
        this.err.push("Passwords don't match");
        return;
      }else{
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
            this.err.push("Email already registered");
          },
        });
      }
      
    } else {
      console.log('error de validacion');
      this.err.push("All fields are required");      
    }
  }

  getUserByEmail($event: Event) {
    //$event.preventDefault();
    
    this.limpiarLista();
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
              window.location.href = '/home';
            });
          this.correctValidation = true;
          console.log(data);
        }
      },
      error: (error) => {
        this.correctValidation = false;
        console.log(error);
        this.err.push("Incorrect email or password");
      },
    });
    
  }

  existeEmail(event: Event) {
    
    this.email = event.target as HTMLInputElement;
    this.email = this.email.value;

    console.log(this.email);
    
    this.bbddService.existEmail(this.email).subscribe({
      next: (data: any) => {
        if (data) {
          console.log(data);
          this.existEmail = true;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  limpiarLista(){
    this.err = [];
  }

  logout() {
    this.authService.logout().then(() => {
      window.location.href = '/';
    })    
  }
swal() {
  Swal.fire({
    title: 'Verify your account',
    background: '#111827',
    text: "You must verify your account in your email!",
    color:'white', 
    icon: 'warning'
  });
}

validateErr() {
  let my_modal = document.getElementById('my_modal') as HTMLDialogElement;
  if(this.err.length == 0){
    this.swal();
    my_modal.close();
  }
}
  
}
