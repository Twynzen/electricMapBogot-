import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/map',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadComponent: () => import('./layout/tabs/tabs.component').then(m => m.TabsComponent),
    children: [
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage)
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/list/list.page').then(m => m.ListPage)
      },
      {
        path: 'news',
        loadComponent: () => import('./pages/news/news.page').then(m => m.NewsPage)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage)
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'station/:id',
    loadComponent: () => import('./pages/station-detail/station-detail.page').then(m => m.StationDetailPage)
  },
  {
    path: '**',
    redirectTo: 'tabs/map'
  }
];
