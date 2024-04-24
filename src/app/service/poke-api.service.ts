import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  private http = inject(HttpClient);
  
  getAllCharacters(){
    let url = new URL("https://pokeapi.co/api/v2/pokemon")

    return this.http.get<any[]>(url.toString());
  }

  getCharacterById(id: string){
    let url = new URL(`https://hp-api.onrender.com/api/character/${id}`);

    return this.http.get<any[]>(url.toString());
  }
}
