import { Component, OnInit, ViewChild } from '@angular/core';
import { TourOverview } from '../../port-app-models/TourOverview';
import { DataService } from '../../services/data.service';
import { Tour } from '../../port-app-models/Tour';
import { Driver } from '../../port-app-models/Driver';
import { Truck } from '../../port-app-models/Truck';
import { Trailer } from '../../port-app-models/Trailer';
import { Client } from '../../port-app-models/Client';
import { City } from '../../port-app-models/City';
import { Load } from '../../port-app-models/Load';
import { State } from '../../port-app-models/State';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { CanActivate, Router } from '@angular/router';
import { ClientTourUpdate } from '../../port-app-models/ClientTourUpdate';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements OnInit {

  @ViewChild('largeModal', {static: false}) public largeModal: ModalDirective;
  @ViewChild('largeModalLoadAdd', {static: false}) public largeModalLoadAdd: ModalDirective;
  @ViewChild('largeModalLoadEdit', {static: false}) public largeModalLoadEdit: ModalDirective;
  @ViewChild('invoiceModal', {static: false}) public invoiceModal: ModalDirective;

  public columnNames = ['#', 'Driver', 'Truck registration', 'Trailer registration', 'Flag', 'Last pickup city', 'Last pickup date','Zip', 'Flag', 'Last delivery city', 'Last delivery date','Zip','LDM', 'Weight', 'View', 'Add', 'History', 'Delete']
  public keys = ['driver_full_name', 'truck_registration', 'trailer_registration', 'flag1', 'last_pickup_city', 'last_pickup_date', 'zip1', 'flag2', 'last_delivery_city', 'last_delivery_date', 'zip2', 'ldm', 'weight']
  
  public tourOverviews: TourOverview[] = [];
  public tourOverviewAll: TourOverview[] = [];
  public tourOverviewCompany: TourOverview[] = [];
  public tourOverviewClient: TourOverview[] = [];
  public parrentComponent = "tours";

  public loadLdmPercentages: string[] = [];
  public loadLdmStyles: string[] = [];

  public loadLdmPercentageAll: string[] = [];
  public loadLdmStylesAll: string[] = [];

  public loadLdmPercentageCompany: string[] = [];
  public loadLdmStylesCompany: string[] = [];

  public loadLdmPercentageClient: string[] = [];
  public loadLdmStylesClient: string[] = [];

  public columnNamesLoads = ['#', 'Goods','LDM', 'Weight', 'Kolets', 'Price','Client', 
  'Pickup city', '', 'zip', 'Pickup date', 'Exporter', 'Delivery city', '', 'zip2', 'Delivery date', 'Importer', 'Client Ref', 'Invoice']

  public keysLoads = ['goods', 'ldm', 'weight', 'kolets', 'price', 'client_name', 'pickup_city', 'flag1', 
  'zip1', 'pickup_date', 'exporter', 'delivery_city', 'flag2', 'zip2', 'delivery_date', 'importer', 'client_ref', 'invoice_number']
  
  public load: Load;

  public loadForEdit: any= '';

  public tourForOverview: any = '';
  public loadsPerTour: any[] = [];

  public clients: Client[] = [];
  public drivers: Driver[] = [];

  public clientNames: any[] = [];

  public pickupCities: City[] = [];
  public deliveryCities: City[] = [];
  public states: State[] = [];

  public tourId: number;

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

  public selectedPickupStateId: string;
  public selectedPickupCityId: string;

  public selectedClientId: number;
  public selectedDriverId: number;

  public selectedDeliveryStateId: string;
  public selectedDeliveryCityId: string;

  private companyTrucks = true;
  private clientTrucks = false;
  private allTrucks = false;

  private editTourCondition = true;
  private companyTourCondition = false;

  private clientTourTrailer: Trailer;


  constructor(private dataService: DataService ,private router: Router) { }

  ngOnInit() {

    this.clientTourTrailer = {} as Trailer;
    this.drivers = [];
    this.companyTrucks = true;
    this.clientTrucks = false;
    this.allTrucks = false;

    this.editTourCondition = false;
    this.companyTourCondition = false;

    this.loadsPerTour = [];
    this.loadForEdit = '';
    this.tourForOverview = '';

    this.tourOverviews = [];
    this.tourOverviewAll = [];
    this.tourOverviewClient = [];
    this.tourOverviewCompany = [];

    this.loadLdmPercentages = [];
    this.loadLdmStyles = [];

    this.loadLdmPercentageAll = [];
    this.loadLdmStylesAll = [];

    this.loadLdmPercentageCompany = [];
    this.loadLdmStylesCompany = [];

    this.loadLdmPercentageClient = [];
    this.loadLdmStylesClient = [];

    this.dataService.getClients().subscribe(
      data => {
      this.clients = data;
      },
      err => {
        console.log('error::');
        console.log(err);
        this.router.navigate(['/login']);
      })

    this.dataService.getStates().subscribe(data => {
      this.states = data;
    })

    this.dataService.getCompanyDrivers().subscribe(data => {
      this.drivers = data;
    })

    this.getLoads();

    
  }

  getLoads() {
    this.dataService.getLoads().subscribe(
      data => {
      //console.log(data);
      let driver: any;
      let truck: Truck;
      let trailer: Trailer;
      let tour: any;
      let driver_full_name: string;
      let truck_registration: string;
      let trailer_registration: string;
      let ldm_view: string;
      let companyTourOverview: boolean;

      data.forEach(dataUnit => {

        tour = dataUnit['tour'];
        driver = tour['driver'];
        truck = tour['truck'];
        trailer = tour['trailer'];

        ldm_view = (tour['ldm']).toFixed(1) + '/' + trailer['ldm']
        
        driver_full_name = driver.name + ' ' + driver.family_name;
        truck_registration = truck.registration_number;
        trailer_registration = trailer.registration_number;

        let last_pickup_date = dataUnit['pickup_date'].split("T")[0];
        let last_pickup_date_array = last_pickup_date.split("-");
        last_pickup_date = last_pickup_date_array[2] + "." + last_pickup_date_array[1] + "." + last_pickup_date_array[0];

        let last_delivery_date = dataUnit['delivery_date'].split("T")[0];
        let last_delivery_date_array = last_delivery_date.split("-");
        last_delivery_date = last_delivery_date_array[2] + "." + last_delivery_date_array[1] + "." + last_delivery_date_array[0];

        
        if(truck.company_truck) {
          companyTourOverview = true;
        } else {
          companyTourOverview = false;
        }

        this.tourOverviewAll.push({tour_id: tour['id'], driver_full_name: driver_full_name, 
        truck_registration: truck_registration, trailer_registration: trailer_registration,
        flag1: dataUnit['flag1'], last_pickup_city: dataUnit['pickup_city'], last_pickup_date: last_pickup_date, 
        zip1: dataUnit['zip1'], 
        flag2: dataUnit['flag2'], last_delivery_city: dataUnit['delivery_city'],last_delivery_date: last_delivery_date, zip2: dataUnit['zip2'], 
        ldm: ldm_view, weight: (tour['weight']).toFixed(2), price: tour['price'], invoice: tour['invoice'], 
        companyTourOverview: companyTourOverview} as TourOverview);

        if(truck.company_truck) {
          this.tourOverviewCompany.push({tour_id: tour['id'], driver_full_name: driver_full_name, 
          truck_registration: truck_registration, trailer_registration: trailer_registration,
          flag1: dataUnit['flag1'], last_pickup_city: dataUnit['pickup_city'], last_pickup_date: last_pickup_date, 
          zip1: dataUnit['zip1'], flag2: dataUnit['flag2'], last_delivery_city: dataUnit['delivery_city'],last_delivery_date: last_delivery_date, zip2: dataUnit['zip2'],
          ldm: ldm_view, weight: (tour['weight']).toFixed(2), price: tour['price'], invoice: tour['invoice'],
          companyTourOverview: companyTourOverview} as TourOverview);
  
        } else {
          this.tourOverviewClient.push({tour_id: tour['id'], driver_full_name: driver_full_name, 
          truck_registration: truck_registration, trailer_registration: trailer_registration,
          flag1: dataUnit['flag1'], last_pickup_city: dataUnit['pickup_city'], last_pickup_date: last_pickup_date, 
          zip1: dataUnit['zip1'], flag2: dataUnit['flag2'], last_delivery_city: dataUnit['delivery_city'],last_delivery_date: last_delivery_date, zip2: dataUnit['zip2'],
          ldm: ldm_view, weight: (tour['weight']).toFixed(2), price: tour['price'], invoice: tour['invoice'],
          companyTourOverview: companyTourOverview} as TourOverview);
        }

        this.tourOverviews = this.tourOverviewCompany;

        let loadLdmPercent = ((tour['ldm']/trailer['ldm'])*100).toFixed(0);
        this.loadLdmPercentageAll.push(loadLdmPercent.toString() + '%');
        if(truck.company_truck) {
          this.loadLdmPercentageCompany.push(loadLdmPercent.toString() + '%');
        } else {
          this.loadLdmPercentageClient.push(loadLdmPercent.toString() + '%');
        }
        console.log(truck);
        //console.log(loadLdmPercent);
        if(Number(loadLdmPercent) < 50) {
          this.loadLdmStylesAll.push('bg-success');
          if(truck.company_truck) {
            this.loadLdmStylesCompany.push('bg-success');
          } else {
            this.loadLdmStylesClient.push('bg-success');
          }

        } else if (Number(loadLdmPercent) < 85) {
          this.loadLdmStylesAll.push('bg-warning');
          if(truck.company_truck) {
            this.loadLdmStylesCompany.push('bg-warning');
          } else {
            this.loadLdmStylesClient.push('bg-warning');
          }
        } else {
          this.loadLdmStylesAll.push('bg-danger');
          if(truck.company_truck) {
            this.loadLdmStylesCompany.push('bg-danger');
          } else {
            this.loadLdmStylesClient.push('bg-danger');
          }
        }

        // if(this.allTrucks) {
        //   this.loadLdmPercentageAll.push(loadLdmPercent.toString() + '%');
        // } else if (this.companyTrucks) {}
        // if(truck.company_truck) {
        //   this.loadLdmPercentageCompany.push(loadLdmPercent.toString() + '%');
        // } else {
        //   this.loadLdmPercentageClient.push(loadLdmPercent.toString() + '%');
        // }
      })
    })
    //console.log('precentages');
    //console.log(this.loadLdmPercentageAll);
    //console.log(this.loadLdmPercentageCompany);
    //console.log(this.loadLdmPercentageClient);

    //this.loadLdmPercentages = [];
    //this.loadLdmStyles = [];
    //if(this.allTrucks) {
    //  this.loadLdmPercentages = this.loadLdmPercentageAll;
    //  this.loadLdmStyles = this.loadLdmStylesAll;
    //} else if(this.companyTrucks) {
      this.loadLdmPercentages = this.loadLdmPercentageCompany;
      this.loadLdmStyles = this.loadLdmStylesCompany;
    //} else if(this.clientTrucks) {
    //  this.loadLdmPercentages = this.loadLdmPercentageClient;
    //  this.loadLdmStyles = this.loadLdmStylesClient;
    }

  //}

  loadClicked(event) {

    //  if(this.allTrucks) {
    //  this.tourForOverview = this.tourOverviewAll[event.i];
    //  } else if(this.companyTrucks) {
    //    this.tourForOverview = this.tourOverviewCompany[event.i];
    //  } else {
    //    this.tourForOverview = this.tourOverviewClient[event.i];
    //  }
    this.tourForOverview = event.dataUnit;

    this.dataService.getTourTrailer(this.tourForOverview.tour_id).subscribe(data => {
      this.clientTourTrailer = data;
    })

    this.companyTourCondition = this.tourForOverview.companyTourOverview;

    //console.log('company tour cond::'+this.companyTourCondition);


    this.dataService.getLoadsPerTour(this.tourForOverview.tour_id).subscribe(data => {
      //console.log(data);
      this.loadsPerTour = data;
      let pickup_date_view: string;
      let pickup_date_view_array: string;
      let delivery_date_view: string;
      let delivery_date_view_array: string;
      this.clients.forEach(client => {
        this.loadsPerTour.forEach(function(load, index, theArray) {

         
          if(client.id == load.client.id) {

            if(theArray[index].invoice == false) {
              theArray[index].invoice_number = '-';
            }

            theArray[index].client_name = client.name;

            pickup_date_view_array = (load.pickup_date.split("T"))[0].split("-");
            pickup_date_view = pickup_date_view_array[2] + "." + pickup_date_view_array[1] + "." + pickup_date_view_array[0];

            delivery_date_view_array = (load.delivery_date.split("T"))[0].split("-");
            delivery_date_view = delivery_date_view_array[2] + "." + delivery_date_view_array[1] + "." + delivery_date_view_array[0];
  
            //console.log('pickup_date_view:' + pickup_date_view);
            load.pickup_date = pickup_date_view;
            load.delivery_date = delivery_date_view;


          }

          pickup_date_view ='';
        })
      })
    })
    
    let element: HTMLElement = document.getElementById('loadsModalButton') as HTMLElement;
    element.click();
    console.log('loads per tour');
    console.log(this.loadsPerTour);
  }

  loadAddClicked(event) {
    //this.tourForOverview = this.tourOverviewAll[event.i];
    //this.tourId = this.tourForOverview

    this.tourForOverview = event.dataUnit;
    console.log('tourForOverview::');
    console.log(this.tourForOverview);

    let element: HTMLElement = document.getElementById('loadsModalAddButton') as HTMLElement;
    element.click();
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
    this.load = ({goods:this.goods, ldm: this.ldm, weight: this.weight, kolets: this.kolets, price: this.price, client_id: this.selectedClientId,
      client_name: this.clientName, pickup_city: this.pickupCity, flag1: this.flag1,
      zip1: this.zip1, pickup_date: this.pickupDate, exporter: this.exporter, delivery_city: this.deliveryCity,
      flag2: this.flag2, zip2: this.zip2, delivery_date: this.deliveryDate, importer: this.importer, client_ref: this.clientRef } as Load);

      this.dataService.saveLoad(this.load, this.tourForOverview.tour_id).subscribe(() => {
        let element: HTMLElement = document.getElementById('loadsModalAddButtonHide') as HTMLElement;
      element.click();
        this.ngOnInit();
      });
    
  }

  deleteClicked(index: any) {
    console.log(index);

    this.load = this.loadsPerTour[index];
    console.log(this.load);
    console.log(this.tourForOverview.tour_id);

    this.dataService.removeLoad(this.load, this.tourForOverview.tour_id).subscribe(() => {
      this.ngOnInit();
      let element: HTMLElement = document.getElementById('loadsModalButtonHide') as HTMLElement;
      element.click();
    });
  }



  editClicked(index: number) {
    this.loadForEdit = this.loadsPerTour[index];
    console.log(this.loadForEdit);
    let element: HTMLElement = document.getElementById('loadsModalEditButton') as HTMLElement;
    element.click();
  }

  editLoad() {
    this.dataService.updateLoad(this.loadForEdit).subscribe(() => {
      //this.ngOnInit();
      //setTimeout(() => {
      //  this.largeModalLoadEdit.hide();
      //},3000);
      this.largeModalLoadEdit.hide();
      this.ngOnInit();
      //this.router.navigate(['/tours']);
    
    
    
    });
    
  }

  // invoiceNotReady() {
  //   return (this.tourForOverview.invoice == true);
  // }

  // invoiceReadyClicked() {
  //   this.dataService.tourInvoice(this.tourForOverview.tour_id).subscribe(() => this.ngOnInit());
  // }

  // invoiceCancelClicked() {
  //   this.dataService.tourInvoice(this.tourForOverview.tour_id).subscribe(() => this.ngOnInit());
  // }

  invoiceClicked(index: number) {
    this.loadForEdit = this.loadsPerTour[index];
    let element: HTMLElement = document.getElementById('invoiceModalButton') as HTMLElement;
    element.click();
  }

  saveInvoice() {
    //console.log('save invoice');
    //console.log(this.loadForEdit);
    this.dataService.saveInvoice(this.loadForEdit).subscribe(() => this.router.navigate(['/tours']));
  }

  closeTourClicked(index: any) {
    let tourForClose;
    if(this.allTrucks == true) {
      tourForClose = this.tourOverviewAll[index];
    } else if (this.companyTrucks == true) {
      tourForClose = this.tourOverviewCompany[index];
    } else if (this.clientTrucks == true) {
      tourForClose = this.tourOverviewClient[index];
    }
    console.log(tourForClose);
    this.dataService.closeTour(tourForClose.tour_id).subscribe(() => this.ngOnInit())
  }

  deleteTourClicked(event) {
    
    let tourForDelete;
    // if(this.allTrucks == true) {
    //   tourForDelete = this.tourOverviewAll[event.i];
    // } else if (this.companyTrucks == true) {
    //   tourForDelete = this.tourOverviewCompany[event.i];
    // } else if (this.clientTrucks == true) {
    //   tourForDelete = this.tourOverviewClient[event.i];
    // }
    tourForDelete = event.dataUnit;
    
    this.dataService.deleteTour(tourForDelete.tour_id).subscribe(() => this.ngOnInit());
  }

  private chooseCompanyTrucks(value: string) {
    
    this.companyTrucks = true;
    this.clientTrucks = false;
    this.allTrucks = false;
    this.tourOverviews = [];
    this.tourOverviews = this.tourOverviewCompany;

    this.loadLdmPercentages = [];
    this.loadLdmStyles = []; 
    this.loadLdmPercentages = this.loadLdmPercentageCompany;
    this.loadLdmStyles = this.loadLdmStylesCompany;

}

private chooseClientTrucks(value: string) {
  
  this.clientTrucks = true;
  this.companyTrucks = false;
  this.allTrucks = false;
  this.tourOverviews = [];
  this.tourOverviews = this.tourOverviewClient;

  this.loadLdmPercentages = [];
  this.loadLdmStyles = [];  
  this.loadLdmPercentages = this.loadLdmPercentageClient;
  this.loadLdmStyles = this.loadLdmStylesClient;
  
}

private chooseAllTrucks(value: string) {
  
  this.allTrucks = true;
  this.clientTrucks = false;
  this.companyTrucks = false;
  this.tourOverviews = [];
  this.tourOverviews = this.tourOverviewAll;

  this.loadLdmPercentages = [];
  this.loadLdmStyles = [];  
  this.loadLdmPercentages = this.loadLdmPercentageAll;
  this.loadLdmStyles = this.loadLdmStylesAll;
    
}

editTourData() {
  this.editTourCondition = true;
}

cancelTourData() {
  this.editTourCondition = false;
}

getDriverFullName(driver: any) {
  return driver.name + ' ' + driver.family_name;
}
saveTourData() {
  if(this.companyTourCondition) {
    this.dataService.updateCompanyTourDriver(this.tourForOverview.tour_id, this.selectedDriverId).subscribe(data => {
      let element: HTMLElement = document.getElementById('loadsModalButtonHide') as HTMLElement;
      this.ngOnInit();
      element.click();
      
    })
  } else {
    
    this.dataService.updateClientTourData({tour_id: this.tourForOverview.tour_id, driver_name: this.tourForOverview.driver_full_name,
    truck_registration: this.tourForOverview.truck_registration, trailer_registration: this.tourForOverview.trailer_registration,
    trailer_ldm: this.clientTourTrailer.ldm, trailer_weight: this.clientTourTrailer.weight, 
    trailer_height: +this.clientTourTrailer.height} as ClientTourUpdate).subscribe(data => {
      let element: HTMLElement = document.getElementById('loadsModalButtonHide') as HTMLElement;
      this.ngOnInit();
      element.click();
    })
  }
 }

 largeModalHide() {
  this.editTourCondition = false;
  this.companyTourCondition = false;
 }

}
