import { Component, OnInit, Inject, inject, signal } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';
import { CommonUtilsService } from '../service/common-utils.service';
import { BbddService } from '../service/bbdd.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watch-pokemons',
  templateUrl: './watch-pokemons.component.html',
  styleUrls: ['./watch-pokemons.component.css'],
})
export class WatchPokemonsComponent implements OnInit {
  pokemons: any = [];
  pokemon: any;
  pokemonsListAux: any = [];
  offset: number = 0;
  limit: number = 15;
  shiny: boolean = false;
  
  private commonUtilsService = inject(CommonUtilsService);
  private bbddService = inject(BbddService);
  user?: any = this.commonUtilsService.getUsuario();
  email?: string;
  idUser = signal(0);

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit() {
    this.email = this.user?.email;
    if(this.email){
    this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
      console.log(data);
      this.idUser.set(data[0].idUser);
    })
  }
    console.log("Usuario desde WP", this.user?.email);
    this.pokeApiService
      .getAllCharacters(this.offset, this.limit)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results;

        for (let i = 0; i < pokemons.results.length; i++) {
          this.pokeApiService
            .getPokemonByUrl(this.pokemons[i].url)
            .subscribe((pokemon: any) => {
              pokemon.color1 = this.commonUtilsService.getColor(pokemon.types[0].type.name);
              if (pokemon.types[1]) {
                pokemon.color2 = this.commonUtilsService.getColor(pokemon.types[1].type.name);
                pokemon.bg_color =
                  'linear-gradient(135deg,' +
                  pokemon.color1 +
                  ' 0%,' +
                  pokemon.color2 +
                  ' 100%)';
              } else {
                pokemon.bg_color = pokemon.color1;
              }
              this.pokemon = pokemon;
              this.pokemonsListAux.push(this.pokemon);
              this.pokemonsListAux.sort((a: any, b: any) => a.id - b.id);
            });
        }
      });
  }
  
  search(event: any) {
    if (event.key === 'Enter') {
    this.pokemonsListAux = [];
    this.pokeApiService
      .getPokemonByName(event.target.value)
      .subscribe((pokemon: any) => {
        pokemon.color1 = this.commonUtilsService.getColor(pokemon.types[0].type.name);
        if (pokemon.types[1]) {
          pokemon.color2 = this.commonUtilsService.getColor(pokemon.types[1].type.name);
          pokemon.bg_color =
            'linear-gradient(135deg,' +
            pokemon.color1 +
            ' 0%,' +
            pokemon.color2 +
            ' 100%)';
        } else {
          pokemon.bg_color = pokemon.color1;
        }
        this.pokemon = pokemon;
        this.pokemonsListAux.push(this.pokemon);
      });
  }
}

 

  next() {
    this.offset += 15;
    this.pokemonsListAux = [];
    this.pokeApiService
      .getAllCharacters(this.offset, this.limit)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results;
        for (let i = 0; i < pokemons.results.length; i++) {
          this.pokeApiService
            .getPokemonByUrl(this.pokemons[i].url)
            .subscribe((pokemon: any) => {
              pokemon.color1 = this.commonUtilsService.getColor(pokemon.types[0].type.name);
              if (pokemon.types[1]) {
                pokemon.color2 = this.commonUtilsService.getColor(pokemon.types[1].type.name);
                pokemon.bg_color =
                  'linear-gradient(135deg,' +
                  pokemon.color1 +
                  ' 0%,' +
                  pokemon.color2 +
                  ' 100%)';
              } else {
                pokemon.bg_color = pokemon.color1;
              }
              this.pokemon = pokemon;
              this.pokemonsListAux.push(this.pokemon);

              this.pokemonsListAux.sort((a: any, b: any) => a.id - b.id);
            });
        }
      });
  }
  prev() {
    this.offset -= 15;
    this.pokeApiService
      .getAllCharacters(this.offset, this.limit)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results;
        this.pokemonsListAux = [];
        for (let i = 0; i < pokemons.results.length; i++) {
          this.pokeApiService
            .getPokemonByUrl(this.pokemons[i].url)
            .subscribe((pokemon: any) => {
              pokemon.color1 = this.commonUtilsService.getColor(pokemon.types[0].type.name);
              if (pokemon.types[1]) {
                pokemon.color2 = this.commonUtilsService.getColor(pokemon.types[1].type.name);
                pokemon.bg_color =
                  'linear-gradient(135deg,' +
                  pokemon.color1 +
                  ' 0%,' +
                  pokemon.color2 +
                  ' 100%)';
              } else {
                pokemon.bg_color = pokemon.color1;
              }
              this.pokemon = pokemon;
              this.pokemonsListAux.push(this.pokemon);
              this.pokemonsListAux.sort((a: any, b: any) => a.id - b.id);
            });
        }
      });
  }

  shinyNS() {
    if (this.shiny) this.shiny = false;
    else this.shiny = true;
  }
  
  addToTeam(idPokemon: number, pokemonType: string, pokemonName: string) {
    this.bbddService.getTeam(this.idUser()).subscribe((team: any) => {
      if(team.length < 5) {
        console.log("Me caben mas" + team.length)
        this.bbddService.addTeam(idPokemon, pokemonType, pokemonName, this.idUser());
      }else{
        console.log("No me caben mas")
      }
    })
  }
  
}
