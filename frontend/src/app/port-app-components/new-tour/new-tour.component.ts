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
import { DataService } from '../../services/data.service';
import { DriversComponent } from '../drivers/drivers.component';
import { TrucksComponent } from '../trucks/trucks.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-tour',
  templateUrl: './new-tour.component.html',
  styleUrls: ['./new-tour.component.scss']
})
export class NewTourComponent implements OnInit {
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
  public trailer: Trailer;
  public trailerLDM: number;
  public selectedPickupStateId: string;
  public selectedClientId: number;
  public selectedDeliveryStateId: string;
  public selectedPickupCityId: string;
  public selectedDeliveryCityId: string;
  public weightSum: number = 0;
  public priceSum: number = 0;

  public selectedDriverId: number;
  public selectedTruckId: number;
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

    // this.dataService.getDrivers().subscribe(data => {
    //   this.drivers = data;
    // })

    this.dataService.getCompanyDrivers().subscribe(data => {
      this.drivers = data;
    })
    
    this.dataService.getReadyTrucks().subscribe(data => {
      console.log('ready trucks::');
      console.log(data);

      data.forEach((e, index) => { 
          //this.drivers.push(e.driver);
          this.trailers.push(e.trailer);
      })
      this.trucks = data.filter(truck => truck.company_truck === true);
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
    //console.log('truck for edit:' + this.truckForEdit.model);
    let element: HTMLElement = document.getElementById('trucksModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(index: number) {
    this.delete_id = this.trucks[index].id;
    //console.log('index='+index + 'delete_id='+this.delete_id);
    //let element: HTMLElement = document.getElementById('trucksModalDeleteButton') as HTMLElement;
    //element.click();

    let load = this.loads[index];
    console.log(load);
    console.log(this.weightSum);

    this.loads.splice(index, 1);
    this.loadsView.splice(index, 1);
    this.weightSum = Number((this.weightSum - load.weight).toFixed(2));
    this.priceSum = Number((this.priceSum - load.price).toFixed(2));

    this.tourLdm = this.tourLdm - Number(load.ldm);

    let tourLdmPercent = ((this.tourLdm/this.trailerLDM)*100).toFixed(0);
    this.tourLdmPercentage = tourLdmPercent + '%';

    //this.tourLdmPercentage = '0%';
  }

  onTruckChange(value) {
       this.trucks.forEach(truck => {
         if(truck.id == value) {
           this.truckRegistration = truck.registration_number;
           this.trailerRegistration = truck.trailer.registration_number;
           this.trailerLDM = truck.trailer.ldm;
           //this.trailer = truck.trailer;
         }
       })
  }

   onDriverChange(value) {
  //   this.trucks.forEach(truck => {
  //     console.log(truck);
  //     if(truck.driver.id == value) {
  //      this.truckRegistration = truck.registration_number;
  //      this.trailerRegistration = truck.trailer.registration_number;
  //      this.trailerLDM = truck.trailer.ldm;
  //     }
  //   });

   }

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
        //console.log('tha CITY::' + city.state);
        this.pickupCity = city.city;
        //this.flag1 = city.state.flag;
      }
    })
    console.log(this.flag1);
  }

  onDeliveryCityChange(deliveryCityId: any) {
    this.deliveryCities.forEach(city => {
      if(city.id == deliveryCityId) {
        this.deliveryCity = city.city;
        //this.flag2 = city.flag;
      }
    })
    //console.log(this.flag2);
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
         this.zip2 == '' || this.zip2 == null || this.deliveryDate == '' || this.deliveryDate == null || this.importer == '' || this.importer == null ||
         this.selectedDriverId == null) {

      this.errorMessage = "Load not saved";
      this.validForm = false;
    } else {
      this.validForm = true;
      this.emptyForm = false;

    let pickup_date_array = this.pickupDate.split('-');
    let pickup_date = pickup_date_array[2] + '.' + pickup_date_array[1] + '.' + pickup_date_array[0];

    let delivery_date_array = this.deliveryDate.split('-');
    let delivery_date = delivery_date_array[2] + '.' + delivery_date_array[1] + '.' + delivery_date_array[0];

    //console.log(pickup_date);

    this.loadsView.push({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
    client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
    zip1: this.zip1, pickup_date: pickup_date, exporter: this.exporter, delivery_city: this.deliveryCity,
    flag2: this.flag2, zip2: this.zip2, delivery_date: delivery_date, importer: this.importer, client_ref: this.clientRef } as Load);

    this.loads.push({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
      client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
      zip1: this.zip1, pickup_date: this.pickupDate, exporter: this.exporter, delivery_city: this.deliveryCity,
      flag2: this.flag2, zip2: this.zip2, delivery_date: this.deliveryDate, importer: this.importer, client_ref: this.clientRef } as Load);

    //console.log('tourLdm :');
    //console.log(this.tourLdm);
    //console.log('triler ldm :');
    //console.log(this.trailerLDM);
    this.tourLdm = this.tourLdm + Number(this.ldm);
    let tourLdmPercent = ((this.tourLdm/this.trailerLDM)*100).toFixed(0);
    this.tourLdmPercentage = tourLdmPercent + '%';
    //console.log('tour percentage:');
    //console.log(this.tourLdmPercentage);

    if(Number(tourLdmPercent) < 50) {
      this.tourLdmStyle = 'bg-success';
    } else if (Number(tourLdmPercent) < 85) {
      this.tourLdmStyle = 'bg-warning';
    } else {
      this.tourLdmStyle = 'bg-danger';
    }

    this.weightSum = Number((this.weightSum + this.weight).toFixed(2));
    this.priceSum = Number((this.priceSum + this.price).toFixed(2));
    this.tourPrice = Number((this.tourPrice + this.price).toFixed(2));
    this.tourLdm = Number(this.tourLdm.toFixed(2));
    this.successMessage = "Load added";

    }

    // let pickup_date_array = this.pickupDate.split('-');
    // let pickup_date = pickup_date_array[2] + '.' + pickup_date_array[1] + '.' + pickup_date_array[0];

    // let delivery_date_array = this.deliveryDate.split('-');
    // let delivery_date = delivery_date_array[2] + '.' + delivery_date_array[1] + '.' + delivery_date_array[0];

    // console.log(pickup_date);

    // this.loadsView.push({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
    // client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
    // zip1: this.zip1, pickup_date: pickup_date, exporter: this.exporter, delivery_city: this.deliveryCity,
    // flag2: this.flag2, zip2: this.zip2, delivery_date: delivery_date, importer: this.importer, client_ref: this.clientRef } as Load);

    // this.loads.push({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
    //   client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
    //   zip1: this.zip1, pickup_date: this.pickupDate, exporter: this.exporter, delivery_city: this.deliveryCity,
    //   flag2: this.flag2, zip2: this.zip2, delivery_date: this.deliveryDate, importer: this.importer, client_ref: this.clientRef } as Load);

    // console.log('tourLdm :');
    // console.log(this.tourLdm);
    // console.log('triler ldm :');
    // console.log(this.trailerLDM);
    // this.tourLdm = this.tourLdm + Number(this.ldm);
    // let tourLdmPercent = ((this.tourLdm/this.trailerLDM)*100).toFixed(0);
    // this.tourLdmPercentage = tourLdmPercent + '%';
    // console.log('tour percentage:');
    // console.log(this.tourLdmPercentage);

    // if(Number(tourLdmPercent) < 50) {
    //   this.tourLdmStyle = 'bg-success';
    // } else if (Number(tourLdmPercent) < 85) {
    //   this.tourLdmStyle = 'bg-warning';
    // } else {
    //   this.tourLdmStyle = 'bg-danger';
    // }

    // this.weightSum = Number((this.weightSum + this.weight).toFixed(2));
    // this.priceSum = Number((this.priceSum + this.price).toFixed(2));
    // this.tourPrice = Number((this.tourPrice + this.price).toFixed(2));
    // this.tourLdm = Number(this.tourLdm.toFixed(2));
  
  }

  saveTour() {
    this.dirtyForm = true;

    if ( this.goods == '' || this.goods == null || this.ldm == '' || this.ldm == null ||  this.weight == null || this.kolets == null ||
         this.price == null || this.selectedClientId == null || this.clientRef == '' || this.clientRef == null || 
         this.selectedPickupStateId == '' || this.selectedPickupStateId == null || this.selectedPickupCityId == '' || this.selectedPickupCityId == null ||
         this.zip1 == null || this.pickupDate == '' || this.pickupDate == null || this.exporter == '' || this.exporter == null || 
         this.selectedDeliveryStateId == '' || this.selectedDeliveryStateId == null || this.selectedDeliveryCityId == '' || this.selectedDeliveryCityId == null ||
         this.zip2 == '' || this.zip2 == null || this.deliveryDate == '' || this.deliveryDate == null || this.importer == '' || this.importer == null ||
         this.selectedDriverId == null) {

          this.errorMessage = "Tour not saved";
          this.validForm = false;

    } else {
    

    //console.log('save tour clicked!');
    //let tourTruckId;
    let tourTrailerId;

    //console.log(this.trucks);
    //console.log(this.trailers);

    //this.trucks.forEach(truck => {
    //  if(truck.registration_number == this.truckRegistration) {
     //   tourTruckId = truck.id;
      //}
    //})
    
    this.trailers.forEach(trailer => {
      if(trailer.registration_number == this.trailerRegistration) {
        tourTrailerId = trailer.id;
      }
    })

    //this.tourPrice = 1412;
    //this.tourWeight = 2.4;
    //this.tourLdm = 4.6;
    this.dataService.saveTour({price: this.tourPrice, weight: this.weightSum, ldm: this.tourLdm, driver_id: this.selectedDriverId, 
      truck_id: this.selectedTruckId, trailer_id: tourTrailerId, loads: this.loads} as Tour).subscribe(() => {

      this.successMessage = "Tour saved";
      this.validForm = true;
      this.emptyForm = false;
      //this.loads = [];
      //this.loadsView = [];
      // this.selectedDriverId = null;
      // this.trailerRegistration = '';
      // this.truckRegistration = '';
      // this.loadsView = [];
      // this.tourLdm = 0;
      // this.trailerLDM = 0;
      // this.weightSum = 0;
      // this.priceSum = 0;
      // this.tourLdmPercentage = '0';

      // this.goods = '';
      // this.ldm = '';
      // this.weight = null;
      // this.kolets = null;
      // this.price = null;

      // this.selectedClientId = null;
      // this.clientRef = '';

      // this.selectedPickupStateId = null;
      // this.selectedPickupCityId = null;
      // this.zip1 = '';
      // this.pickupDate = '';
      // this.exporter = '';

      // this.selectedDeliveryStateId = null;
      // this.selectedDeliveryCityId = null;
      // this.zip2 = '';
      // this.deliveryDate = null;
      // this.importer = '';
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
