import { Routes } from '@angular/router';
import { Contact } from './components/contact/contact';
import { Gbdp } from './components/gbdp/gbdp';
import { Balance } from './components/balance/balance';
import { Home } from './pages/home/home';
import { Languages } from './components/nglanguages/nglanguages';
import { Material } from './components/material/material';
import { Elwp } from './components/elwp/elwp';
import { Api } from './components/api/api';
import { Game } from './components/game/game';
import { Magnets } from './components/magnets/magnets';
import { Tableau } from './components/tableau/tableau';
import { Fyp } from './components/fyp/fyp';
import { About } from './components/about/about';
import { authGuard } from './services/auth.guard';

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
