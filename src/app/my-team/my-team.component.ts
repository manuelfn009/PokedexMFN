import { Component } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';

@Component({
  selector: 'app-my-team',
  standalone: true,
  imports: [],
  templateUrl: './my-team.component.html',
  styleUrl: './my-team.component.css'
})
export class MyTeamComponent {

  constructor(private pokeApiService: PokeApiService) { }

  pokemons: any = []

  ngOnInit() {
    this.pokeApiService
      .getPokemonsById(1)
      .subscribe((pokemons: any) => {
        this.pokemons = pokemons.results
      })
      console.log("Pokemons", this.pokemons)
  }
}
