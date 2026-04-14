import { Routes } from '@angular/router';
import { Contact } from './shared/contact/contact';
import { Gbdp } from './shared/gbdp/gbdp';
import { Balance } from './shared/balance/balance';
import { Home } from './shared/home/home';
import { Languages } from './shared/nglanguages/nglanguages';
import { Material } from './shared/material/material';
import { Elwp } from './shared/elwp/elwp';
import { Api } from './shared/api/api';
import { Game } from './shared/game/game';
import { Magnets } from './shared/magnets/magnets';
import { Tableau } from './shared/tableau/tableau';
import { Fyp } from './shared/fyp/fyp';
import { About } from './shared/about/about';
import { authGuard } from './shared/services/auth.guard';
import { Matlab } from './shared/matlab/matlab';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  {
    path: 'languages',
    pathMatch: 'full',
    component: Languages,
  },
  {
    path: 'material',
    pathMatch: 'full',
    component: Material,
  },
  {
    path: 'elwp',
    pathMatch: 'full',
    component: Elwp,
  },
  {
    path: 'api',
    pathMatch: 'full',
    component: Api,
  },
  {
    path: 'game',
    pathMatch: 'full',
    component: Game,
  },
  {
    path: 'magnets',
    pathMatch: 'full',
    component: Magnets,
  },
  {
    path: 'tableau',
    pathMatch: 'full',
    component: Tableau,
  },
  {
    path: 'fyp',
    pathMatch: 'full',
    component: Fyp,
  },
  {
    path: 'matlab',
    pathMatch: 'full',
    component: Matlab,
  },
  {
    path: 'gbdp',
    pathMatch: 'full',
    component: Gbdp,
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: About,
  },
  {
    path: 'contact',
    pathMatch: 'full',
    component: Contact,
  },
  {
    path: 'balance',
    pathMatch: 'full',
    component: Balance,
    canActivate: [authGuard],
  },
];
