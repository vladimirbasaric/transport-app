import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
//import { Driver} from '../../port-app-models/Driver';
import { Truck } from '../../port-app-models/Truck';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Driver } from '../../port-app-models/Driver';
import { Trailer } from '../../port-app-models/Trailer';
import { Client } from '../../port-app-models/Client';
import { ClientTourCarier } from '../../port-app-models/ClientTourCarier';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.component.html',
  styleUrls: ['./trucks.component.scss']
})
export class TrucksComponent implements OnInit {

  @ViewChild('largeModal', {static: false}) public largeModal: ModalDirective;
  @ViewChild('largeModalDelete', {static: false}) public largeModalDelete: ModalDirective;
  @ViewChild('formDirective', {static: false})form: any;
  

  public truck: Truck = {
    id: '',
    model: '', 
    registration_number: '',
    driver_name: '',
    trailer_registration_number: '',
    company_truck: '',
  }

  public trucks: Truck[] = [];
  public drivers: Driver[] = [];
  public trailers: Trailer[] = [];
  public columnNames = ['#', 'Model', 'Registration number', 'Trailer Registration', 'Edit', 'Delete']
  keys = ['model','registration_number', 'trailer_registration_number']
  public truckForEdit: any= '';
  public delete_id: any = '';
  selectedTruckDriverId: any = '';
  selectedDriverId: any = '';
  selectedTrailerId: any = '';
  selectedTruckTrailerId: any = '';

  private companyTrucks = true;
  private clientTrucks = false;
  private allTrucks = false;

  private companyTruckNew ;

  public companyTrucksArray: Truck[] = [];
  public clientTrucksArray: Truck[] = [];
  public allTrucksArray: Truck[] = [];

  //client truck
  private selectedClientName: string;
  private clientTruckRn: string;
  private clientTrailerRn: string;
  private clientTruckLdm: string;
  private clientTruckWeight: string;
  private clientTruckCustomRef: string;

  public clients: Client[] = [];
  public validForm = false;
  public emptyForm = true;
  public dirtyForm = false;
  public errorMessage: string;


  constructor(private dataService: DataService, private router: Router) { }

  isCollapsed: boolean = true;
  iconCollapse: string = 'icon-arrow-down';

  isCollapsed2: boolean = true;
  iconCollapse2: string = 'icon-arrow-down';

  isCollapsed3: boolean = true;
  iconCollapse3: string = 'icon-arrow-down';

  isCollapsed4: boolean = true;
  iconCollapse4: string = 'icon-arrow-down';

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

  toggleCollapse2(): void {
    this.isCollapsed2 = !this.isCollapsed2;
    this.iconCollapse2 = this.isCollapsed2 ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  toggleCollapse3(): void {
    this.isCollapsed3 = !this.isCollapsed3;
    this.iconCollapse3 = this.isCollapsed3 ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  toggleCollapse4(): void {
    this.isCollapsed4 = !this.isCollapsed4;
    this.iconCollapse4 = this.isCollapsed4 ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  public ngOnInit()
  {
    this.validForm = false;
    this.emptyForm = true;  
    this.dirtyForm = false;

      this.companyTrucks = true;
      this.clientTrucks = false;
      this.allTrucks = false;
      
      this.clients = [];
      this.selectedClientName = '';
      this.clientTruckRn = '';
      this.clientTrailerRn = '';
      this.clientTruckLdm = '';
      this.clientTruckWeight = '';
      this.clientTruckCustomRef = '';

    this.dataService.getTrucks().subscribe(
      data => {
    
      let driver_full_name: string = '';
      let trailer_registration: string = '';

      this.trucks = [];
      this.clientTrucksArray = [];
      this.companyTrucksArray = [];
      this.allTrucksArray = [];
      
      data.forEach((e, index) => { 
        
        if (e.driver) {
          driver_full_name = e.driver.name + ' ' + e.driver.family_name
        } else {
          driver_full_name = '/';
        }

        if (e.trailer) {
          trailer_registration = e.trailer.registration_number;
        } else {
          trailer_registration = '/';
        }

        if(e.company_truck) {
          this.companyTrucksArray.push({id:e.id, model:e.model, 
            registration_number:e.registration_number, 
            driver_name:driver_full_name, 
            trailer_registration_number:trailer_registration, company_truck: e.company_truck});
        } else {
          this.clientTrucksArray.push({id:e.id, model:e.model, 
            registration_number:e.registration_number, 
            driver_name:driver_full_name, 
            trailer_registration_number:trailer_registration, company_truck: e.company_truck});
        }

        this.allTrucksArray.push({id:e.id, model:e.model, 
          registration_number:e.registration_number, 
          driver_name:driver_full_name, 
          trailer_registration_number:trailer_registration, company_truck: e.company_truck});
        
      })

      this.trucks = this.companyTrucksArray;

      this.dataService.getDrivers().subscribe(data => {
        this.drivers = data;
        });

      // this.dataService.getTrailers().subscribe(data => {
      //   this.trailers = data;
      // })

      this.dataService.getCompanyTrailers().subscribe(data => {
           this.trailers = data;
         })

      this.dataService.getClients().subscribe(data => {
        this.clients = data;
      })

      },
      err => {
        this.router.navigate(['/login']);
      });
  }

  getDriverFullName(driver: any) {
    
    return driver.name + ' ' + driver.family_name;
  }

  getTruckInfo(truck: any) {
    return truck.model + '-' + truck.registration_number;
  }

  editClicked(event) {
    // if(this.allTrucks) {
    //   this.truckForEdit = this.trucks[event.i];
    // } else if (this.companyTrucks) {
    //   this.truckForEdit = this.companyTrucksArray[event.i];
    // } else {
    //   this.truckForEdit = this.clientTrucksArray[event.i];
    // }
    this.truckForEdit = event.dataUnit;
    
    let element: HTMLElement = document.getElementById('trucksModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(event) {
    // if(this.allTrucks) {
    // this.delete_id = this.trucks[event.i].id;
    // } else if (this.companyTrucks) {
    //   this.delete_id = this.companyTrucksArray[event.i].id;
    // } else {
    //   this.delete_id = this.clientTrucksArray[event.i].id;
    // }

    this.delete_id = event.dataUnit.id;

    this.dataService.canDeleteTruck(this.delete_id).subscribe(data => {
      
      if(data .response == 'true') {
        let element: HTMLElement = document.getElementById('trucksModalDeleteButton') as HTMLElement;
        element.click();
      } else {
        this.validForm = false;
        this.dirtyForm = true;
        this.errorMessage = "Can't delete truck. Already connected to some tour";
      }
    })
    
  }

  resetTruckNewFields() {
    this.form.reset();
    //(<HTMLInputElement>document.getElementById('model')).value = '';
    //(<HTMLInputElement>document.getElementById('registration_number')).value = '';
  }

  saveTruck(model, registration_number) {
    this.dirtyForm = true;
    if(model == '' || model == null || registration_number == '' || registration_number == null) {
      // show error
      this.validForm = false;
      this.errorMessage = "Error";
      
    } else {
      this.validForm = true;
      this.emptyForm = false;
      //add new truck
      //this.resetTruckNewFields();
      
      if(this.companyTruckNew == null) {
        this.companyTruckNew = false;
      }
      let truck: Truck= {
        id : '',
        driver_name: '',
        trailer_registration_number: '',
        model: model,
        registration_number: registration_number, 
        //company_truck: this.companyTruckNew
        company_truck: 'true'
      }
      this.dataService.saveTruck(truck).subscribe
      (() => {
        setTimeout(() => {
          this.resetTruckNewFields();
          this.ngOnInit();
        }, 1500);
      })
    }
  }

  // saveTruck(model, registration_number) {
  //   this.resetTruckNewFields();
  //   console.log('companyTruck');
  //   console.log(this.companyTruckNew);
  //   if(this.companyTruckNew == null) {
  //     this.companyTruckNew = false;
  //   }
  //   let truck: Truck= {
  //     id : '',
  //     driver_name: '',
  //     trailer_registration_number: '',
  //     model: model,
  //     registration_number: registration_number, 
  //     //company_truck: this.companyTruckNew
  //     company_truck: 'true'
  //   }
  //   this.dataService.saveTruck(truck).subscribe
  //   (() => {
  //     this.ngOnInit();
  //   })
    
  // }


  updateTruck(id, model, registration_number) {
    this.dataService
    .updateTruck(
      {id, model, registration_number} as Truck).subscribe
      (() => {this.ngOnInit(); })
  }

  deleteTruck() {
    this.dataService.deleteTruck(this.delete_id).subscribe(() => {

      this.trucks.forEach((truck, index) => {
        if(truck.id == this.delete_id) {
          if(truck.company_truck) {
            this.companyTrucksArray.forEach((companyTruck, index2) => {
              if(companyTruck.id == this.delete_id) {
                this.companyTrucksArray.splice(index2, 1);
              }
            })
          } else {
            this.clientTrucksArray.forEach((clientTruck, index2) => {
              if(clientTruck.id == this.delete_id) {
                this.clientTrucksArray.splice(index2, 1);
              }
            })
          }

          this.trucks.splice(index, 1);

        }
      })

        this.ngOnInit();
      })
  }

  attachDriverToTruck() {

    this.dirtyForm = true;
    if(this.selectedDriverId == '' || this.selectedDriverId == null || this.selectedTruckDriverId == '' || this.selectedTruckDriverId == null) {
      // show error
      this.validForm = false;
      
    } else {
      this.validForm = true;
      this.emptyForm = false;

      this.dataService.attachDriverToTruck(this.selectedDriverId, this.selectedTruckDriverId).subscribe(() => {
        setTimeout(() => {
          this.resetTruckNewFields();
          this.ngOnInit();
        }, 1500);
      })
    }

    //console.log('selected truck id::' + this.selectedTruckDriverId);
    // this.dataService.attachDriverToTruck(this.selectedDriverId, this.selectedTruckDriverId).subscribe(() => {
    //   this.ngOnInit();
    // })
  }

  removeDriverFromTruck() {
    this.dataService.removeDriverFromTruck(this.selectedTruckDriverId).subscribe(() => {
      this.ngOnInit();
    })
  }

  attachTrailerToTruck() {

    this.dirtyForm = true;
    if(this.selectedTrailerId == '' || this.selectedTrailerId == null || this.selectedTruckTrailerId == '' || this.selectedTruckTrailerId == null) {
      // show error
      this.validForm = false;
      
    } else {
      this.validForm = true;
      this.emptyForm = false;

      this.dataService.attachTrailerToTruck(this.selectedTrailerId, this.selectedTruckTrailerId).subscribe(() => {
        setTimeout(() => {
          this.resetTruckNewFields();
          this.ngOnInit();
        }, 1500);
      })
    }



    //console.log('selected truck id::' + this.selectedTruckDriverId);
    // this.dataService.attachTrailerToTruck(this.selectedTrailerId, this.selectedTruckTrailerId).subscribe(() => {
    //   this.ngOnInit();
    // })
  }

  removeTrailerFromTruck() {
    this.dataService.removeTrailerFromTruck(this.selectedTruckTrailerId).subscribe(() => {
      this.ngOnInit();
    })
  }

  private chooseCompanyTrucks(value: string) {
    
    this.companyTrucks = true;
    this.clientTrucks = false;
    this.allTrucks = false;
    this.trucks = [];
    this.trucks = this.companyTrucksArray;
  }

  private chooseClientTrucks(value: string) {
  
    this.clientTrucks = true;
    this.companyTrucks = false;
    this.allTrucks = false;
    this.trucks = [];
    this.trucks = this.clientTrucksArray;
  }

  private chooseAllTrucks(value: string) {
    
    this.allTrucks = true;
    this.clientTrucks = false;
    this.companyTrucks = false;
    this.trucks = [];
    this.trucks = this.allTrucksArray;
  }

  saveClientTruck() {

    this.dirtyForm = true;
    if(this.selectedClientName == '' || this.selectedClientName == null || this.clientTruckCustomRef == '' || this.clientTruckCustomRef == null) {
      // show error
      this.validForm = false;
      this.errorMessage = 'Error';
      
    } else {
      this.validForm = true;
      this.emptyForm = false;


      if(this.clientTruckRn == '') {
        this.clientTruckRn = '/';
      }
  
      if(this.clientTrailerRn == '') {
        this.clientTrailerRn = '/';
      }
  
      if(this.clientTruckLdm == '') {
        this.clientTruckLdm = '/';
      }
  
      if(this.clientTruckWeight == '') {
        this.clientTruckWeight = '/';
      }
  
      //let driverName = this.selectedClientName + ' ' + this.clientTruckCustomRef; 
  
      let clientTourCarier: ClientTourCarier = {
        client_driver_name : this.selectedClientName,
        client_truck_registration_number: this.clientTruckRn,
        client_trailer_registartion_number: this.clientTrailerRn,
        client_truck_ldm: this.clientTruckLdm,
        client_truck_weight: this.clientTruckWeight,
        client_custom_reference: this.clientTruckCustomRef
      }
  
      this.dataService.saveClientTourCarrier(clientTourCarier).subscribe(() => {
        setTimeout(() => {
              this.resetTruckNewFields();
              this.ngOnInit();
            }, 1500);
      })
    }
    
    // if(this.clientTruckRn == '') {
    //   this.clientTruckRn = '/';
    // }

    // if(this.clientTrailerRn == '') {
    //   this.clientTrailerRn = '/';
    // }

    // if(this.clientTruckLdm == '') {
    //   this.clientTruckLdm = '/';
    // }

    // if(this.clientTruckWeight == '') {
    //   this.clientTruckWeight = '/';
    // }

    // //let driverName = this.selectedClientName + ' ' + this.clientTruckCustomRef; 

    // let clientTourCarier: ClientTourCarier = {
    //   client_driver_name : this.selectedClientName,
    //   client_truck_registration_number: this.clientTruckRn,
    //   client_trailer_registartion_number: this.clientTrailerRn,
    //   client_truck_ldm: this.clientTruckLdm,
    //   client_truck_weight: this.clientTruckWeight,
    //   client_custom_reference: this.clientTruckCustomRef
    // }

    // this.dataService.saveClientTourCarrier(clientTourCarier).subscribe(() => {
    //   this.ngOnInit();
    // })

  }

  errorAlertClicked() {
    this.dirtyForm = false;
  }

  successAlertClicked() {
    this.emptyForm = true;
  } 


}
