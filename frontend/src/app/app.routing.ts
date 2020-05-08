import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { DriversComponent } from './port-app-components/drivers/drivers.component';
import { TrucksComponent } from './port-app-components/trucks/trucks.component';
import { TrailersComponent } from './port-app-components/trailers/trailers.component';
import { ToursComponent } from './port-app-components/tours/tours.component';
import { NewTourComponent } from './port-app-components/new-tour/new-tour.component';
import { NewClientTourComponent } from './port-app-components/new-client-tour/new-client-tour.component';
import { StatesComponent } from './port-app-components/states/states.component';
import { CitiesComponent } from './port-app-components/cities/cities.component';
import { ClientsComponent } from './port-app-components/clients/clients.component';
import { TourHistoryComponent } from './port-app-components/tour-history/tour-history.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tours',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'drivers',
        component: DriversComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Drivers'
        }
      },
      {
        path: 'trucks',
        component: TrucksComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Trucks'
        }
      },
      {
        path: 'trailers',
        component: TrailersComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Trailers'
        }
      },
      {
        path: 'tours',
        component: ToursComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Tours'
        }
      },
      {
        path: 'new-tour',
        component: NewTourComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'New Tour'
        }
      },
      {
        path: 'new-client-tour',
        component: NewClientTourComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'New Client Tour'
        }
      },
      {
        path: 'states',
        component: StatesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'States'
        }
      },
      {
        path: 'cities',
        component: CitiesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Cities'
        }
      },

      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Clients'
        }
      },
      {
        path: 'tour-history',
        component: TourHistoryComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Tour History'
        }
      },
      
      /*{
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      }*/
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
