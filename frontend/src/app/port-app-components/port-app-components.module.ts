import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { DriversComponent } from './drivers/drivers.component';
import { TrucksComponent } from './trucks/trucks.component';
import { CustomtableComponent } from './customtable/customtable.component';

import { CollapsesComponent } from '../views/base/collapses.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TrailersComponent } from './trailers/trailers.component';
import { ToursComponent } from './tours/tours.component';
import { NewTourComponent } from './new-tour/new-tour.component';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';
import { ClientsComponent } from './clients/clients.component';
import { TourHistoryComponent } from './tour-history/tour-history.component';
import { NewClientTourComponent } from './new-client-tour/new-client-tour.component';

@NgModule({
    imports: [
        BrowserModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        FormsModule,
        CollapseModule,
        ModalModule
    ],
    declarations: [
        DriversComponent, 
        TrucksComponent,
        CustomtableComponent,
        CollapsesComponent,
        TrailersComponent,
        ToursComponent,
        NewTourComponent,
        StatesComponent,
        CitiesComponent,
        ClientsComponent,
        TourHistoryComponent,
        NewClientTourComponent
        
    ]
})
export class PortAppModule{}