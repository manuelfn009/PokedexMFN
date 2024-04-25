import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { enviroment } from '../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private s_client = createClient(enviroment.supabaseUrl, enviroment.supabaseKey);
  constructor() { }

  login(email: string, password: string) {
    return this.s_client.auth.signInWithPassword({ email: email, password: password });
  }

  logout() {
    return this.s_client.auth.signOut();
  }

  signUp(email: string, password: string) {
    return this.s_client.auth.signUp({ email: email, password: password });
  }
}
