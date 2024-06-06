import { Component, OnInit } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';

@Component({
  selector: 'app-table-types',
  standalone: true,
  imports: [],
  templateUrl: './table-types.component.html',
  styleUrls: ['./table-types.component.css']
})
export class TableTypesComponent implements OnInit {
  // Variables to store Pokémon types and their damage relations
  types: any = [];
  type: any;
  damages: any = [];
  url: any;

  // Inject the PokeApiService
  constructor(private pokeApiService: PokeApiService) { }

  // Lifecycle hook to initialize the component
  ngOnInit() {
    // Fetch all Pokémon types
    this.pokeApiService.getAllTypes().subscribe((types: any) => {
      // Store the types
      this.types = types.results;

      // Iterate over each type to fetch detailed information
      for (let i = 0; i < this.types.length; i++) {
        this.pokeApiService.getTypeByUrl(this.types[i].url).subscribe((type: any) => {
          // Replace the type with detailed information
          this.types[i] = type;
        });
      }

      // Log the types for debugging purposes
      console.log("Tipos", this.types);
    });
  }
}
