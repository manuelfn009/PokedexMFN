import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { enviroment } from '../../enviroment'
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BbddService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(enviroment.supabaseUrl, enviroment.supabaseKey);
    // this.signUp();
  }

  signUp(name: string, surname: string, email: string, password: string): Observable<[]> {
    return from(this.supabase
      .from('User')
      .insert([{ name: name, surname: surname, email: email, password: password }])
      .select()
      .then(response => response.data as []));
  }

  getUserByEmail(email: string, password: string): Observable<[]> {
    return from(this.supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .then(response => response.data as []));
  }

  getUsuarioOnlyByEmail(email: string): Observable<[]> {
    return from(this.supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .then(response => response.data as []));
  }

  signOut() {
    this.supabase.auth.signOut();
  }

  addTeam(idPokemon: number, pokemonType: string, pokemonName: string, idUser: number) {
    this.supabase
      .from('Team')
      .insert([{ idPokemon: idPokemon, pokemonType: pokemonType, pokemonName: pokemonName, idUser: idUser}])
      .select()
      .then(response => response.data as [])
  }

  getTeam(idUser: number): Observable<[]> {
    return from(this.supabase
      .from('Team')
      .select('*')
      .eq('idUser', idUser)
      .then(response => response.data as []));
  }
}
