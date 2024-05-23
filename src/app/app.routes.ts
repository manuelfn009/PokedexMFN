import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { WatchPokemonsComponent } from './watch-pokemons/watch-pokemons.component';
import { TableTypesComponent } from './table-types/table-types.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { FightComponent } from './fight/fight.component';

export const routes: Routes = [
    {
        path: '',
        component: IndexComponent
    },
    {
        path: 'home',
        component: IndexComponent
    },
    {
        path: 'watchPokemons',
        component: WatchPokemonsComponent
    },
    {
        path: 'tableTypes',
        component: TableTypesComponent
    },
    {
        path: 'myTeam',
        component: MyTeamComponent
    },
    {
        path: 'fight',
        component: FightComponent
    }
];
