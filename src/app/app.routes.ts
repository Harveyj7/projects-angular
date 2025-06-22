import { Routes } from '@angular/router';
// import { Carousel } from './components/carousel/carousel';
// import { Languages } from './components/languages/languages';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    {
        path: 'languages',
        pathMatch: 'full',
        loadComponent: () => import('./components/languages/languages').then(m => m.Languages)
    }
];
