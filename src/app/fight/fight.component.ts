import { Component, inject } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';
import { BbddService } from '../service/bbdd.service';
import { CommonUtilsService } from '../service/common-utils.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fight',
  standalone: true,
  imports: [NgFor, CommonModule, RouterLink],
  templateUrl: './fight.component.html',
  styleUrl: './fight.component.css',
})
export class FightComponent {
  // Injecting services
  bbddService: BbddService = inject(BbddService);
  commonUtilsService = inject(CommonUtilsService);
  pokeApiService = inject(PokeApiService);

  // Component properties
  currentIndex: number = 0;
  aleatoryTeam: any = [];
  pokemon: any;
  user?: any = this.commonUtilsService.getUsuario();
  email?: string;
  idUser = this.user?.idUser;
  figthing: boolean = false;
  userTeam: any = [];
  listId: any = [];
  pokemons: any = [];
  type1: any;
  type2: any;
  double_df: any = [];
  typesA: any = [];
  double_dt: any = [];
  index: number = -2;
  contIA = 0;
  contUser = 0;
  teamWinner: string = '';

  ngOnInit() {
    // Fetch user email
    this.email = this.user?.email;
    if (this.email) {
      // Get user details by email
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log(this.idUser);
      });
    }

    // Get user's team
    this.bbddService.getTeam(this.idUser).subscribe((team: any) => {
      console.log(team);
      // Store team Pokemon IDs
      for (let i = 0; i < team.length; i++) {
        this.listId.push(team[i].idPokemon);
        console.log(this.listId);
      }
      // Fetch Pokemon details for each ID
      for (let i = 0; i < this.listId.length; i++) {
        this.pokeApiService.getPokemonsById(this.listId[i]).subscribe((pokemon: any) => {
          this.pokemon = pokemon;
          this.pokemons.push(this.pokemon);
          console.log(this.pokemons);
          console.log(this.listId[i]);
        });
      }
    });
  }

  // Generate a random team
  getAleatoryTeam() {
    let aleatoryIds: number[] = [];
    for (let index = 0; index < 6; index++) {
      let aleatory = Math.floor(Math.random() * 898) + 1;
      console.log(aleatory);
      aleatoryIds.push(aleatory);
    }

    // Fetch details for each random Pokemon
    for (let index = 0; index < aleatoryIds.length; index++) {
      let url = new URL('https://pokeapi.co/api/v2/pokemon/' + aleatoryIds[index]);
      console.log('url:', url.toString());
      this.pokeApiService.getPokemonByUrl(url.toString()).subscribe((pokemon: any) => {
        this.pokemon = pokemon;
        console.log('pokemon:', pokemon);
        this.aleatoryTeam.push(pokemon);
      });
    }
  }

  // Start the fight
  fight() {
    this.figthing = true;
  }

  // Increment the index for the next fight round
  incrementIndex() {
    this.index = (this.index + 1) % 6; 
    this.pokemonVsPokemon(this.index + 1); 
  }

  // Compare two Pokemons in a fight
  pokemonVsPokemon(currentIndex: number) {
    this.typesA = [];
    this.double_df = [];
    this.double_dt = [];

    // Fetch type details of the opponent Pokemon
    this.pokeApiService.getTypeByUrl(this.aleatoryTeam[currentIndex].types[0].type.url).subscribe((type: any) => {
      this.typesA = type;
      
      // Store types that deal double damage to and from the opponent Pokemon
      for (let i = 0; i < this.typesA.damage_relations.double_damage_from.length; i++) {          
        this.double_df.push(this.typesA.damage_relations.double_damage_from[i].name);
      }
      for(let i = 0; i < this.typesA.damage_relations.double_damage_to.length; i++){
        this.double_dt.push(this.typesA.damage_relations.double_damage_to[i].name);
      }

      // Determine the winner based on type advantages and stats
      if(this.double_df.includes(this.pokemons[currentIndex].types[0].type.name)){
        console.log(this.pokemons[currentIndex].name,' wins');
        this.contUser++;
      } else if (this.double_dt.includes(this.pokemons[currentIndex].types[0].type.name)) {
        console.log(this.aleatoryTeam[currentIndex].name,' wins');
        this.contIA++;
      } else if (this.pokemons[currentIndex].stats[1].base_stat > this.aleatoryTeam[currentIndex].stats[1].base_stat) {
        console.log(this.aleatoryTeam[currentIndex].name,' wins');
        this.contIA++;
      } else if (this.pokemons[currentIndex].stats[1].base_stat < this.aleatoryTeam[currentIndex].stats[1].base_stat) {
        console.log(this.pokemons[currentIndex].name,' wins');
        this.contUser++;
      } else{
        this.contUser++;
        this.contIA++;
        console.log('Draw');
      }
    });
  }
}
