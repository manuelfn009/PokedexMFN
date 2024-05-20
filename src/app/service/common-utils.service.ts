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
  getColor(type: string): string {
    switch (type) {
      case 'grass':
        return '#8FEFB0';
      case 'fire':
        return '#FAB27A';
      case 'water':
        return '#7AB9FA';
      case 'bug':
        return '#A2E840';
      case 'normal':
        return '#B0B1B0';
      case 'poison':
        return '#BF67FA';
      case 'electric':
        return '#FAEB67';
      case 'ground':
        return '#DC8C31';
      case 'fairy':
        return '#F576DA';
      case 'fighting':
        return '#FD3838';
      case 'psychic':
        return '#F57676';
      case 'rock':
        return '#D5B295';
      case 'ghost':
        return '#2D3F9A';
      case 'ice':
        return '#7FF6F8';
      case 'dragon':
        return '#6F26E4';
      case 'dark':
        return '#3E3A45';
      case 'steel':
        return '#D6D5D7';
      case 'flying':
        return '#A2B0FF';
      case 'unknown':
        return '#05935F';
      default:
        return 'bg-white';
    }
  }
}
