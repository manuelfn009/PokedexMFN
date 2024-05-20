import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  private baseUrl = "https://pokeapi.co/api/v2/pokemon/";
  private typeUrl = "https://pokeapi.co/api/v2/type/";

  constructor(private http: HttpClient) { }

  getAllCharacters(offset: number, limit: number){
    let url = new URL(this.baseUrl);
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('limit', limit.toString());

    return this.http.get<any[]>(url.toString());
  }

  getPokemonByName(name: string){
    let url = new URL(this.baseUrl);
    url.searchParams.set('name', name);
    return this.http.get<any>(url.toString());
  }

  getPokemonByUrl(url: string){
    return this.http.get<any>(url.toString());
  }

  getPokemonsByUrl(urls: string[]){
    return urls.map(url => this.getPokemonByUrl(url));
  }

  getAllTypes(){
    let url = new URL(this.typeUrl);
    return this.http.get<any[]>(url.toString());
  }

  getTypeByUrl(url: string){
    return this.http.get<any>(url.toString());
  }
  
}