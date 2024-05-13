import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { WatchPokemonsComponent } from './watch-pokemons/watch-pokemons.component';
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
    }
];
