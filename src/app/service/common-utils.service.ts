import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  constructor() { }

  usuario: any;

  getUsuario() {
    return this.usuario
  }

  setUsuario(user: any) {
    this.usuario = user
  }
}
