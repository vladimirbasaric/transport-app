import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Driver } from '../../port-app-models/Driver';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})

export class DriversComponent implements OnInit {

  @ViewChild('largeModal', {static: false}) public largeModal: ModalDirective;
  @ViewChild('largeModalDelete', {static: false}) public largeModalDelete: ModalDirective;
  @ViewChild('formDirective', {static: false})form: any;

  public driver: Driver = {
    id: '',
    name: '',
    familyName: '',
    passport_number: '',
    phone: '',
    cmr: '',
    company: '',
    company_driver: ''
  }

  public companyDrivers: Driver[] = [];
  public clientDrivers: Driver[] = [];
  public allDrivers: Driver[] = [];
  public drivers: Driver[];
  
  public columnNames = ['#','Name', 'Family name / reference', 'Passport number', 'Phone', 'CMR', 'Company', 'Edit', 'Delete'];
  public keys = ['name', 'family_name', 'passport_number', 'phone', 'cmr', 'company'];
  public driverForEdit: any= '';
  public delete_id: any = '';
  public validForm = false;
  public emptyForm = true;
  public dirtyForm = false;
  public errorMessage: string;

  private companyDriversRadioButton = true;
  private clientDriversRadioButton = false;
  private allDriversRadioButton = false;

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

  public ngOnInit() {
    this.drivers = [];
    this.companyDrivers = [];
    this.clientDrivers = [];
    this.allDrivers = [];

    this.companyDriversRadioButton = true;
    this.clientDriversRadioButton = false;
    this.allDriversRadioButton = false;

    this.validForm = false;
    this.emptyForm = true;  
    this.dirtyForm = false;

    this.dataService.getDrivers().subscribe(data => {
      console.log(data);
      this.drivers = data;
      this.allDrivers = data;

      data.forEach((e, index) => { 
        if(e.company_driver) {
          this.companyDrivers.push(e);
        } else {
          this.clientDrivers.push(e); 
        }
      })
      this.drivers = this.companyDrivers;
    },
    err => {
      this.router.navigate(['/login']);
    });
  }

  editClicked(event) {
    // console.log(event);
    // if(this.allDriversRadioButton) {
    //   this.driverForEdit = this.drivers[event.i];
    // } else if (this.companyDriversRadioButton) {
    //   this.driverForEdit = this.companyDrivers[event.i];
    // } else {
    //   this.driverForEdit = this.clientDrivers[event.i];
    // }

    this.driverForEdit = event.dataUnit as Driver;

    let element: HTMLElement = document.getElementById('driversModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(event) {

    // if(this.allDriversRadioButton) {
    //   this.delete_id = this.drivers[event.i].id;
    // } else if (this.companyDriversRadioButton) {
    //   this.delete_id = this.companyDrivers[event.i].id;
    // } else {
    //   this.delete_id = this.clientDrivers[event.i].id;
    // }

    this.delete_id = event.dataUnit.id;

    this.dataService.canDeleteDriver(this.delete_id).subscribe(data => {
      console.log(data.response);
      if(data.response == 'true') {
        console.log('index='+event.i + 'delete_id='+this.delete_id);
        let element: HTMLElement = document.getElementById('driversModalDeleteButton') as HTMLElement;
        element.click();
      } else {
        this.validForm = false;
        this.dirtyForm = true;
        this.errorMessage = "Can't delete driver. Already connected to some tour";
      }
    })
  }

  resetDriverNewFields() {
    this.form.reset();
    // (<HTMLInputElement>document.getElementById('driverName')).value = '';
    // (<HTMLInputElement>document.getElementById('driverFamilyName')).value = '';
    // (<HTMLInputElement>document.getElementById('passportNumber')).value = '';
    // (<HTMLInputElement>document.getElementById('phone')).value = '';
    // (<HTMLInputElement>document.getElementById('cmr')).value = '';
    // (<HTMLInputElement>document.getElementById('company')).value = '';
  }
  

  saveDriver(name, familyName, passport_number, phone, cmr, company ){
    //console.log(name);

    this.dirtyForm = true;
    if( name == ''|| name == null || familyName == '' || familyName == null || passport_number == '' || passport_number == null || 
        phone == '' || phone == null || cmr == '' || cmr == null || company == '' || company == null) {
      // Show Error
      this.validForm = false;
      this.errorMessage = "Error";
      //console.log('form is not valid');
    } else {
      // show success alert
      this.validForm = true;
      this.emptyForm = false;

      let company_driver = 'true';
      // Add new Driver
      this.dataService.saveDriver({ 
        name, 
        familyName, 
        passport_number, 
        phone, 
        cmr, 
        company,
        company_driver 
      } as Driver).subscribe (() => {
        setTimeout(() => {
          this.resetDriverNewFields();
          this.ngOnInit();
        }, 1500);       
      })
    }
  }

  updateDriver(id, name, familyName, passport_number, phone, cmr, company) {
    this.dataService.updateDriver({
      id, 
      name, 
      familyName, 
      passport_number, 
      phone, 
      cmr, 
      company
    } as Driver).subscribe (() => {
      this.ngOnInit(); 
    })
  }

  deleteDriver() {
    this.dataService.deleteDriver(this.delete_id).subscribe(() => {
        this.ngOnInit();
      })
  }

  errorAlertClicked() {
    this.dirtyForm = false;
  }

  successAlertClicked() {
    this.emptyForm = true;
  } 

  private chooseCompanyDrivers(value: string) {

    this.companyDriversRadioButton = true;
    this.clientDriversRadioButton = false;
    this.allDriversRadioButton = false;
    this.drivers = [];
    this.drivers = this.companyDrivers;
  }

  private chooseClientDrivers(value: string) {
    
    this.clientDriversRadioButton = true;
    this.companyDriversRadioButton = false;
    this.allDriversRadioButton = false;
    this.drivers = [];
    this.drivers = this.clientDrivers;
  }

  private chooseAllDrivers(value: string) {
    
    this.allDriversRadioButton = true;
    this.clientDriversRadioButton = false;
    this.companyDriversRadioButton = false;
    this.drivers = [];
    this.drivers = this.allDrivers;
  }

  
}


