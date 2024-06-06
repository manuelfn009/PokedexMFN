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
  // Variables to store Pokémon data and user information
  pokemons: any = [];
  pokemon: any;
  pokemonsListAux: any = [];
  offset: number = 0;
  limit: number = 15;
  shiny: boolean = false;
  team: any = [];
  errTeam: boolean = false;
  addPokemon: boolean = false;

  // Injecting services and initializing user-related variables
  private commonUtilsService = inject(CommonUtilsService);
  private bbddService = inject(BbddService);
  user?: any = this.commonUtilsService.getUsuario();
  email?: string;
  idUser = signal(0);

  constructor(private pokeApiService: PokeApiService) { }

  ngOnInit() {
    // Fetch initial Pokémon data and load user information
    this.user = this.commonUtilsService.getUsuario();
    this.email = this.user?.email;
    if (this.email) {
      // Fetch user details by email
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser.set(data[0].idUser);
      });
    }

    // Fetch initial set of Pokémon characters
    this.pokeApiService
      .getAllCharacters(this.offset, this.limit)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results;

        // Fetch detailed information for each Pokémon
        for (let i = 0; i < pokemons.results.length; i++) {
          this.pokeApiService
            .getPokemonByUrl(this.pokemons[i].url)
            .subscribe((pokemon: any) => {
              // Assign colors based on Pokémon types
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

  // Handle Enter key press for search functionality
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputElement = event.target as HTMLInputElement;
      this.search(inputElement.value);
    }
  }

  // Load user information
  loadUser() {
    this.user = this.commonUtilsService.getUsuario();
  }

  // Reload the page based on input
  reload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value === '') {
      window.location.href = '/watchPokemons';
    }
  }

  // Search for a specific Pokémon by name
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

  // Check the length of the team
  checkLenTeam() {
    this.team = this.bbddService.getTeam(this.idUser()).subscribe((team: any) => {
      this.team = team;
      console.log(this.team);
      if (this.team.length == 6) {
        this.addPokemon = false;
        this.errTeam = true;
      } else {
        this.errTeam = false;
        this.addPokemon = true;
      }
    })
  }
 // Next button
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
  // Prev button
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
 // Shiny mode toggle
  shinyNS() {
    if (this.shiny) this.shiny = false;
    else this.shiny = true;
  }
  // Add pokemon to team
  addToTeam(idPokemon: number, pokemonType: string, pokemonName: string) {
    this.bbddService.getTeam(this.idUser()).subscribe((team: any) => {
      if (team.length < 6) {
        this.bbddService.addTeam(idPokemon, pokemonType, pokemonName, this.idUser());
      } else {
      }
    })
  }

  // Change class for flip animation
  changeClass(pokemonId : number) {
    let cardFlip = document.getElementById(pokemonId.toString()) as HTMLDivElement;
    let cardFront = document.getElementById("front-" + pokemonId.toString() ) as HTMLDivElement;
    let global = document.getElementById("global-" + pokemonId.toString()) as HTMLDivElement;
    cardFlip.classList.toggle("card-flip");
    cardFront.classList.toggle("cardflip");
    global.style.background = "rgb(28, 28, 53)";
    global.style.transition = "all 1s";
    global.style.transform = "rotateY(180deg)";
  }
  // Go back to normal with flip animation too
  goBack(pokemonId : number, bg_color: string) {
    let cardFlip = document.getElementById(pokemonId.toString()) as HTMLDivElement;
    let cardFront = document.getElementById("front-" + pokemonId.toString() ) as HTMLDivElement;
    let global = document.getElementById("global-" + pokemonId.toString()) as HTMLDivElement;
    cardFlip.classList.remove("card-flip");
    cardFront.classList.remove("cardflip");
    global.style.background = bg_color;
    global.style.transform = "rotateY(0deg)";
    global.addEventListener('mouseover', () => global.style.scale = "105%")
    global.addEventListener('mouseout', () => global.style.scale = "100%")
  }
}
