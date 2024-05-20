import { Component, OnInit, Inject, inject } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';
import { WatchPokemonsComponent } from '../watch-pokemons/watch-pokemons.component';

@Component({
  selector: 'app-table-types',
  standalone: true,
  imports: [],
  templateUrl: './table-types.component.html',
  styleUrl: './table-types.component.css'
})
export class TableTypesComponent implements OnInit{

  types: any = [];
  type: any
  damages: any = [];
  url: any

  constructor(private pokeApiService: PokeApiService) { }

  ngOnInit() {
    this.pokeApiService
      .getAllTypes()
      .subscribe((types: any) => {
        this.types = types.results;

        for (let i = 0; i < this.types.length; i++) {
          this.pokeApiService
            .getTypeByUrl(this.types[i].url)
            .subscribe((type: any) => {
              this.types[i] = type;
                          })
        }
        
      console.log("Tipos", this.types);
      });
  }

}

