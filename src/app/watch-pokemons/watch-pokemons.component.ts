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
  team: any = [];
  errTeam: boolean = false;

  private commonUtilsService = inject(CommonUtilsService);
  private bbddService = inject(BbddService);
  user?: any = this.commonUtilsService.getUsuario();
  email?: string;
  idUser = signal(0);

  constructor(private pokeApiService: PokeApiService) { }

  ngOnInit() {
    this.user = this.commonUtilsService.getUsuario();
    this.email = this.user?.email;
    if (this.email) {
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser.set(data[0].idUser);
      });
    }

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

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputElement = event.target as HTMLInputElement;
      this.search(inputElement.value);
    }
  }

  loadUser() {
    this.user = this.commonUtilsService.getUsuario();
  }

  reload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value === '') {
      window.location.href = '/home';
      window.location.href = '/watchPokemons';
    }
    
  }


  search(pokemonName: string) {
    console.log(pokemonName);

    const pokemons = this.pokemonsListAux;
    this.pokemonsListAux = [];

    


    this.pokeApiService
      .getPokemonByName(pokemonName.toLowerCase())
      .subscribe((pokemon: any) => {

        this.pokemon = pokemon;
        console.log(this.pokemon);
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
        this.user = this.commonUtilsService.getUsuario();
        console.log(this.user);
        this.pokemon = pokemon;
        this.pokemonsListAux.push(this.pokemon);
        this.pokemonsListAux.sort((a: any, b: any) => a.id - b.id);
      });

  }

  checkLenTeam() {
    this.team = this.bbddService.getTeam(this.idUser()).subscribe((team: any) => {
      this.team = team;
      console.log(this.team);
      if (this.team.length == 5) {
        this.errTeam = true;
      } else {
        this.errTeam = false;
      }
    })
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
      if (team.length < 5) {
        this.bbddService.addTeam(idPokemon, pokemonType, pokemonName, this.idUser());
      } else {
      }
    })
  }

}
