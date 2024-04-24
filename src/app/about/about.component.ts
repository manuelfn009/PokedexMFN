import { Component, inject } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private pokeApiService = inject(PokeApiService);

  pokemons: any = [];
  pokemon: any;

  ngOnInit() {
    this.pokeApiService.getAllCharacters().subscribe((pokemons: any) => {
      this.pokemons = pokemons.results
      console.log(pokemons);
      this.pokeApiService.getPokemonByUrl(this.pokemons[0].url).subscribe((pokemon: any) => {
        this.pokemon = pokemon
        console.log(pokemon)
      });
    });
  }
}
