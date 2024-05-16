import { Component, OnInit, Inject } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';

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

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit() {
    this.pokeApiService
      .getAllCharacters(this.offset, this.limit)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results;

        for (let i = 0; i < pokemons.results.length; i++) {
          this.pokeApiService
            .getPokemonByUrl(this.pokemons[i].url)
            .subscribe((pokemon: any) => {
              pokemon.color1 = this.getColor(pokemon.types[0].type.name);
              if (pokemon.types[1]) {
                pokemon.color2 = this.getColor(pokemon.types[1].type.name);
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

  getColor(type: string): string {
    switch (type) {
      case 'grass':
        return '#8FEFB0';
      case 'fire':
        return '#FAB27A';
      case 'water':
        return '#7AB9FA';
      case 'bug':
        return '#A2E840';
      case 'normal':
        return '#B0B1B0';
      case 'poison':
        return '#BF67FA';
      case 'electric':
        return '#FAEB67';
      case 'ground':
        return '#DC8C31';
      case 'fairy':
        return '#F576DA';
      case 'fighting':
        return '#FD3838';
      case 'psychic':
        return '#F57676';
      case 'rock':
        return '#D5B295';
      case 'ghost':
        return '#2D3F9A';
      case 'ice':
        return '#7FF6F8';
      case 'dragon':
        return '#6F26E4';
      case 'dark':
        return '#3E3A45';
      case 'steel':
        return '#D6D5D7';
      case 'flying':
        return '#A2B0FF';
      case 'unknown':
        return '#05935F';
      default:
        return 'bg-white';
    }
  }

  next() {
    this.offset += 15;
    this.pokeApiService
      .getAllCharacters(this.offset, this.limit)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results;
        this.pokemonsListAux = [];
        for (let i = 0; i < pokemons.results.length; i++) {
          this.pokeApiService
            .getPokemonByUrl(this.pokemons[i].url)
            .subscribe((pokemon: any) => {
              pokemon.color1 = this.getColor(pokemon.types[0].type.name);
              if (pokemon.types[1]) {
                pokemon.color2 = this.getColor(pokemon.types[1].type.name);
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
              pokemon.color1 = this.getColor(pokemon.types[0].type.name);
              if (pokemon.types[1]) {
                pokemon.color2 = this.getColor(pokemon.types[1].type.name);
                pokemon.bg_color =
                  'linear-gradient(135deg,' +
                  pokemon.color1 +
                  ' 0%,' +
                  pokemon.color2 +
                  ' 100%)';
              }else {
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
  this.shiny = true;
}

}
