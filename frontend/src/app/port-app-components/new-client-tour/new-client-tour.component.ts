import { Component, OnInit, ViewChild } from '@angular/core';
import { Truck } from '../../port-app-models/Truck';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Driver } from '../../port-app-models/Driver';
import { Trailer } from '../../port-app-models/Trailer';
import { State } from '../../port-app-models/State';
import { City } from '../../port-app-models/City';
import { Client } from '../../port-app-models/Client';
import { Load } from '../../port-app-models/Load';
import { Tour } from '../../port-app-models/Tour';
import { ClientTour } from '../../port-app-models/ClientTour';
import { DataService } from '../../services/data.service';
import { DriversComponent } from '../drivers/drivers.component';
import { TrucksComponent } from '../trucks/trucks.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-client-tour',
  templateUrl: './new-client-tour.component.html',
  styleUrls: ['./new-client-tour.component.css']
})
export class NewClientTourComponent implements OnInit {
  @ViewChild('formDirective', {static: false})form: any;


  public columnNames = ['#', 'Goods','LDM', 'Weight', 'Kolets', 'Price','Client', 
  'Pickup city', '', 'zip', 'Pickup date', 'Exporter', 'Delivery city', '', 'zip2', 'Delivery date', 'Importer', 'Client Ref']

  public keys = ['goods', 'ldm','weight', 'kolets', 'price', 'client_name', 'pickup_city', 'flag1', 
  'zip1', 'pickup_date', 'exporter', 'delivery_city', 'flag2', 'zip2', 'delivery_date', 'importer', 'client_ref']
  public parrentComponent = "new-tour";
  public tourLdmPercentage: string;
  public tourLdmStyle: string;
  //pickupDate: any;
  //public loads: number[] = [];
  public truckRegistration: string;
  public trailerRegistration: string;
  public trailerLDM: number;
  public selectedPickupStateId: string;
  public selectedClientId: number;
  public selectedDeliveryStateId: string;
  public selectedPickupCityId: string;
  public selectedDeliveryCityId: string;
  public weightSum: number = 0;
  public priceSum: number = 0;

  //client tour
  public clientDriverName: string;
  public clientTruckRegistration: string;
  public clientTrailerRegistration: string;
  //-----------

  public selectedDriverId: number;
  public tourPrice: number = 0;
  public tourWeight: number = 0;
  public tourLdm: number = 0;

  public loads: Load[] = [];
  public loadsView: Load[] = [];

  public trucks: any[] = [];
  public drivers: any[] = [];
  public trailers: any[] = [];
  public states: State[] = [];
  public clients: Client[] = [];
  public pickupCities: City[] = [];
  public deliveryCities: City[] = [];

  public loadForEdit: any= '';
  public delete_id: any = '';

  public pickupState: any = '';
  public deliveryState: any = '';

//load data
  public goods: string;
  public ldm: string;
  public weight: number;
  public kolets: number;
  public price: number;
  public clientName: string;
  public pickupCity: string;
  public flag1: string;
  public zip1: string;
  public pickupDate: string;
  public exporter: string;
  public deliveryCity: string;
  public flag2: string;
  public zip2: string;
  public deliveryDate: string;
  public importer: string;
  public clientRef: string;

  public validForm = false;
  public emptyForm = true;
  public dirtyForm = false;

  public successMessage: string;
  public errorMessage: string;


  constructor(private dataService: DataService, private router: Router) { }

  isCollapsed: boolean = true;
  iconCollapse: string = 'icon-arrow-down';

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  ngOnInit() {

    this.loadsView = [];
    this.loads = [];
    this.validForm = false;
    this.emptyForm = true;  
    this.dirtyForm = false;

    this.dataService.getLoads().subscribe(data => {
      console.log(data);
    },
    err => {
      this.router.navigate(['/login']);
    })
    
    this.dataService.getReadyTrucks().subscribe(data => {
      console.log('ready trucks::');
      console.log(data);

      data.forEach((e, index) => { 
          this.drivers.push(e.driver);
          this.trailers.push(e.trailer);
      })
      this.trucks = data;
    })

    this.dataService.getStates().subscribe(data => {
      this.states = data;
    })

    this.dataService.getClients().subscribe(data => {
      this.clients = data;
    })
  }

  resetFields() {
    this.form.reset();
  }

  getDriverFullName(driver: any) {
    return driver.name + ' ' + driver.family_name;
  }

  editClicked(index: number) {
    this.loadForEdit = this.trucks[index];
    let element: HTMLElement = document.getElementById('trucksModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(index: number) {
    this.delete_id = this.trucks[index].id;

    let load = this.loads[index];

    this.loads.splice(index, 1);
    this.loadsView.splice(index, 1);
    this.weightSum = Number((this.weightSum - load.weight).toFixed(2));
    this.priceSum = Number((this.priceSum - load.price).toFixed(2));

    this.tourLdm = this.tourLdm - Number(load.ldm);

    let tourLdmPercent = ((this.tourLdm/this.trailerLDM)*100).toFixed(0);
    this.tourLdmPercentage = tourLdmPercent + '%';

  }

  // onDriverChange(value) {
  //   this.trucks.forEach(truck => {
  //     console.log(truck);
  //     if(truck.driver.id == value) {
  //      this.truckRegistration = truck.registration_number;
  //      this.trailerRegistration = truck.trailer.registration_number;
  //      this.trailerLDM = truck.trailer.ldm;
  //     }
  //   });

  // }

  onPickupStateChange(stateId: any) {
    this.dataService.getCitiesPerState(stateId).subscribe(data => {
      this.pickupCities = data;
    })

    this.states.forEach(state => {
      if(state.id == stateId) {
        this.flag1 = state.flag;
      }
    })
  } 

  onDeliveryStateChange(stateId: any) {
    this.dataService.getCitiesPerState(stateId).subscribe(data => {
      this.deliveryCities = data;
    })

    this.states.forEach(state => {
      if(state.id == stateId) {
        this.flag2 = state.flag;
      }
    })
  }

  onPickupCityChange(pickupCityId: any){
    
    this.pickupCities.forEach(city => {
      if(city.id == pickupCityId) {
        this.pickupCity = city.city;
      }
    })
  }

  onDeliveryCityChange(deliveryCityId: any) {
    this.deliveryCities.forEach(city => {
      if(city.id == deliveryCityId) {
        this.deliveryCity = city.city;
      }
    })
  }

  onClientChange(clientId: any) {
    this.clients.forEach(client => {
      if(client.id == clientId) {
        this.clientName = client.name;
      }
    })
  }

  addLoad() {
    console.log(this.loadsView);
    this.dirtyForm = true;
    if ( this.goods == '' || this.goods == null || this.ldm == '' || this.ldm == null ||  this.weight == null || this.kolets == null ||
         this.price == null || this.selectedClientId == null || this.clientRef == '' || this.clientRef == null || 
         this.selectedPickupStateId == '' || this.selectedPickupStateId == null || this.selectedPickupCityId == '' || this.selectedPickupCityId == null ||
         this.zip1 == null || this.pickupDate == '' || this.pickupDate == null || this.exporter == '' || this.exporter == null || 
         this.selectedDeliveryStateId == '' || this.selectedDeliveryStateId == null || this.selectedDeliveryCityId == '' || this.selectedDeliveryCityId == null ||
         this.zip2 == '' || this.zip2 == null || this.deliveryDate == '' || this.deliveryDate == null || this.importer == '' || this.importer == null) {

      this.errorMessage = "Load not saved";
      this.validForm = false;
    } else {
      this.validForm = true;
      this.emptyForm = false;

    let pickup_date_array = this.pickupDate.split('-');
    let pickup_date = pickup_date_array[2] + '.' + pickup_date_array[1] + '.' + pickup_date_array[0];

    let delivery_date_array = this.deliveryDate.split('-');
    let delivery_date = delivery_date_array[2] + '.' + delivery_date_array[1] + '.' + delivery_date_array[0];

    this.loadsView.push({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
    client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
    zip1: this.zip1, pickup_date: pickup_date, exporter: this.exporter, delivery_city: this.deliveryCity,
    flag2: this.flag2, zip2: this.zip2, delivery_date: delivery_date, importer: this.importer, client_ref: this.clientRef } as Load);

    this.loads.push({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
      client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
      zip1: this.zip1, pickup_date: this.pickupDate, exporter: this.exporter, delivery_city: this.deliveryCity,
      flag2: this.flag2, zip2: this.zip2, delivery_date: this.deliveryDate, importer: this.importer, client_ref: this.clientRef } as Load);

    this.tourLdm = this.tourLdm + Number(this.ldm);
    let tourLdmPercent = ((this.tourLdm/this.trailerLDM)*100).toFixed(0);
    this.tourLdmPercentage = tourLdmPercent + '%';

    if(Number(tourLdmPercent) < 50) {
      this.tourLdmStyle = 'bg-success';
    } else if (Number(tourLdmPercent) < 85) {
      this.tourLdmStyle = 'bg-warning';
    } else {
      this.tourLdmStyle = 'bg-danger';
    }

    this.weightSum = Number((this.weightSum + this.weight).toFixed(2));
    console.log(this.weightSum);
    console.log(this.weight);
    this.priceSum = Number((this.priceSum + this.price).toFixed(2));
    this.tourPrice = Number((this.tourPrice + this.price).toFixed(2));
    this.tourLdm = Number(this.tourLdm.toFixed(2));
    this.successMessage = "Load added";

    }
  }

  saveTour() {
    this.dirtyForm = true;

    if ( this.goods == '' || this.goods == null || this.ldm == '' || this.ldm == null ||  this.weight == null || this.kolets == null ||
         this.price == null || this.selectedClientId == null || this.clientRef == '' || this.clientRef == null || 
         this.selectedPickupStateId == '' || this.selectedPickupStateId == null || this.selectedPickupCityId == '' || this.selectedPickupCityId == null ||
         this.zip1 == null || this.pickupDate == '' || this.pickupDate == null || this.exporter == '' || this.exporter == null || 
         this.selectedDeliveryStateId == '' || this.selectedDeliveryStateId == null || this.selectedDeliveryCityId == '' || this.selectedDeliveryCityId == null ||
         this.zip2 == '' || this.zip2 == null || this.deliveryDate == '' || this.deliveryDate == null || this.importer == '' || this.importer == null) {

          this.errorMessage = "Tour not saved";
          this.validForm = false;

    } else {
    

    

    // this.trucks.forEach(truck => {
    //   if(truck.registration_number == this.truckRegistration) {
    //     tourTruckId = truck.id;
    //   }
    // })

    // this.trailers.forEach(trailer => {
    //   if(trailer.registration_number == this.trailerRegistration) {
    //     tourTrailerId = trailer.id;
    //   }
    // })

    this.dataService.saveClientTour({price: this.tourPrice, weight: this.weightSum, ldm: this.tourLdm, driver_name: this.clientDriverName, 
      truck_registration: this.clientTruckRegistration, trailer_registration: this.clientTrailerRegistration, loads: this.loads} as ClientTour).subscribe(() => {
        this.successMessage = "Tour saved";
      });

    }
  }

  getWidth() {
    return this.tourLdmPercentage;
  }

  errorAlertClicked() {
    this.dirtyForm = false;
  }

  successAlertClicked() {
    this.emptyForm = true;
  } 

}
