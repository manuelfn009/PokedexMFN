import { Component, inject } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';
import { BbddService } from '../service/bbdd.service';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { CommonUtilsService } from '../service/common-utils.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-team',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './my-team.component.html',
  styleUrl: './my-team.component.css'
})
export class MyTeamComponent {

  constructor(private pokeApiService: PokeApiService) { }

  private commonUtilsService = inject(CommonUtilsService);
  private bbddService = inject(BbddService);

  pokemons: any = []          // Array to store user's Pokemon
  pokemon: any                // Variable to store a single Pokemon
  url: string = ""            // URL string for Pokemon API
  listId: any = []            // List of Pokemon IDs
  user?: any = this.commonUtilsService.getUsuario(); // Get user information
  email?: string;             // User's email
  idUser = this.user?.idUser; // User's ID

  ngOnInit() {
    // Get user email
    this.email = this.user?.email;
    if (this.email) {
      // Fetch user data by email
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log(this.idUser);
      });

      // Fetch user's team
      this.bbddService.getTeam(this.idUser).subscribe((team: any) => {
        console.log(team);
        for (let i = 0; i < team.length; i++) {
          this.listId.push(team[i].idPokemon);
          console.log(this.listId);
        }
        // Fetch each Pokemon's details
        for (let i = 0; i < this.listId.length; i++) {
          this.pokeApiService.getPokemonsById(this.listId[i]).subscribe((pokemon: any) => {
            this.pokemon = pokemon;
            this.pokemons.push(this.pokemon);
            console.log(this.pokemons);
            console.log(this.listId[i]);
          });
        }
        console.log("Pokemons", this.pokemons);
      });
    }
  }

  // Delete a single Pokemon from the team
  deletePokemon(id: number) {
    this.email = this.user?.email;
    if (this.email) {
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log("idUser", this.idUser);
        console.log("idPokemon", id);
        
        // Delete Pokemon from team by ID
        this.bbddService.deletePokemonFromTeam(id, this.idUser).subscribe((data: any) => {
          console.log(data);
          this.pokemons = [];
          this.listId = [];

          // Refresh team data after deletion
          this.bbddService.getTeam(this.idUser).subscribe((team: any) => {
            console.log(team.length);
            for (let i = 0; i < team.length; i++) {
              this.listId.push(team[i].idPokemon);
              console.log(this.listId);
            }
            for (let i = 0; i < this.listId.length; i++) {
              this.pokeApiService.getPokemonsById(this.listId[i]).subscribe((pokemon: any) => {
                this.pokemon = pokemon;
                this.pokemons.push(this.pokemon);
                console.log(this.pokemons);
                console.log(this.listId[i]);
              });
            }
            console.log("Pokemons", this.pokemons);
          });
        });
      });
    }
  }

  // Delete all Pokemon from the team
  deleteAll() {
    this.email = this.user?.email;
    if (this.email) {
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log("idUser", this.idUser);

        // Delete all Pokemon from the team
        this.bbddService.deleteAllPokemonsFromTeam(this.idUser).subscribe((data: any) => {
          console.log(data);
          this.pokemons = [];
          this.listId = [];

          // Refresh team data after deletion
          this.ngOnInit();
        });
      });
    }
  }
}