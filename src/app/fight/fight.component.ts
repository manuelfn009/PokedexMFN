import { Component, inject } from '@angular/core';
import { PokeApiService } from '../service/poke-api.service';
import { BbddService } from '../service/bbdd.service';
import { CommonUtilsService } from '../service/common-utils.service';

@Component({
  selector: 'app-fight',
  standalone: true,
  imports: [],
  templateUrl: './fight.component.html',
  styleUrl: './fight.component.css'
})
export class FightComponent {
  bbddService: BbddService = inject(BbddService);
  commonUtilsService = inject(CommonUtilsService);


  constructor(pokeApiService: PokeApiService) { }

  pokeApiService = inject(PokeApiService);
  aleatoryTeam: any = [];
  pokemon: any;
  user?: any = this.commonUtilsService.getUsuario();
  email?: string;
  idUser = this.user?.idUser;


  ngOnInit() {
    this.email = this.user?.email;
    if (this.email) {
      this.bbddService.getUsuarioOnlyByEmail(this.email).subscribe((data: any) => {
        console.log(data);
        this.idUser = data[0].idUser;
        console.log(this.idUser);
      })}
    let aleatoryIds: number[] = [];
    for (let index = 0; index < 6; index++) {
      let aleatory = Math.floor(Math.random() * 898) + 1
      console.log(aleatory)
      aleatoryIds.push(aleatory)
    }

    for (let index = 0; index < aleatoryIds.length; index++) {
      let url = new URL("https://pokeapi.co/api/v2/pokemon/" + aleatoryIds[index]);
      console.log("url:", url.toString())
      this.pokeApiService.getPokemonByUrl(url.toString()).subscribe((pokemon: any) => {
        this.pokemon = pokemon
        console.log("pokemon:", pokemon)
        this.aleatoryTeam.push(pokemon)
      })      
    }
    console.log(this.aleatoryTeam)
  
}
}
