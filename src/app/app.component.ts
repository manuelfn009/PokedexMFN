import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './service/auth.service';
import { BbddService } from './service/bbdd.service';
import { CommonUtilsService } from './service/common-utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Inject services & set variables
  title = 'pokedexMFN';
  supabase = inject(BbddService);
  authService = inject(AuthService);
  commonUtilsService = inject(CommonUtilsService);
  usuario = this.commonUtilsService.getUsuario();

  // Check if user is logged in
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
}
