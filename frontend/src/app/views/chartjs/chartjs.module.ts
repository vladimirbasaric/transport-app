import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { ChartJSComponent } from './chartjs.component';
import { ChartJSRoutingModule } from './chartjs-routing.module';

@NgModule({
  imports: [
    ChartJSRoutingModule,
    ChartsModule,
    CommonModule,
    
    FormsModule
  ],
  declarations: [ ChartJSComponent]
})
export class ChartJSModule { }
