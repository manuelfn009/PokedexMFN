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
      .insert([{ name: name, surname: surname, email: email, password: password}])
      .select()
      .then(response => response.data as []));
  }
}
