import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'languages',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/languages/languages').then((m) => m.Languages),
  },
  {
    path: 'elwp',
    pathMatch: 'full',
    loadComponent: () => import('./components/elwp/elwp').then((m) => m.Elwp),
  },
  {
    path: 'game',
    pathMatch: 'full',
    loadComponent: () => import('./components/game/game').then((m) => m.Game),
  },
  {
    path: 'magnets',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/magnets/magnets').then((m) => m.Magnets),
  },
  {
    path: 'tableau',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/tableau/tableau').then((m) => m.Tableau),
  },
  {
    path: 'fyp',
    pathMatch: 'full',
    loadComponent: () => import('./components/fyp/fyp').then((m) => m.Fyp),
  },
  {
    path: 'gbdp',
    pathMatch: 'full',
    loadComponent: () => import('./components/gbdp/gbdp').then((m) => m.Gbdp),
  },
  {
    path: 'about',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/about/about').then((m) => m.About),
  },
];
