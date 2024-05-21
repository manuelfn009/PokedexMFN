import { Component, inject, signal } from '@angular/core';
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

  pokemons: any = []
  pokemon: any
  url: string = ""
  listId: any = []
  user?: any = this.commonUtilsService.getUsuario();
  email?: string;
  idUser = this.user?.idUser;

  ngOnInit() {
    this.email = this.user?.email;
    if (this.email) {
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log(this.idUser);
      })
      this.bbddService.getTeam(this.idUser).subscribe((team: any) => {
        console.log(team);
        for (let i = 0; i < team.length; i++) {
          this.listId.push(team[i].idPokemon);
          console.log(this.listId);
        }
        for (let i = 0; i < this.listId.length; i++) {
          this.pokeApiService
            .getPokemonsById(this.listId[i])
            .subscribe((pokemon: any) => {
              this.pokemon = pokemon
              this.pokemons.push(this.pokemon)
              console.log(this.pokemons);
              console.log(this.listId[i]);
            })
        }
        console.log("Pokemons", this.pokemons)
      })

    }
  }

  deletePokemon(id: number) {
    this.email = this.user?.email;
    if (this.email) {
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log("idUser",this.idUser);
        console.log("idPokemon",id);
        this.bbddService.deletePokemonFromTeam(id, this.idUser);
      })
    }}




  }
