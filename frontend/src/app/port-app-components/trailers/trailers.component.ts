import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Trailer } from '../../port-app-models/Trailer';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trailers',
  templateUrl: './trailers.component.html',
  styleUrls: ['./trailers.component.scss']
})

export class TrailersComponent implements OnInit {

  @ViewChild('largeModal', {static: false}) public largeModal: ModalDirective;
  @ViewChild('largeModalDelete', {static: false}) public largeModalDelete: ModalDirective;
  @ViewChild('formDirective', {static: false})form: any;

  public trailer: Trailer = {
    id: '',
    registration_number: '',
    ldm: 0, 
    weight: 0,
    height: null,
    company_trailer: ''
  }


  public trailers: Trailer[];
  public companyTrailers: Trailer[];
  public clientTrailers: Trailer[];
  public allTrailers: Trailer[];

  public columnNames = ['#', 'Registration number', 'LDM', 'Weight', 'Height', 'Edit', 'Delete']
  public keys = ['registration_number', 'ldm', 'weight', 'height']
  public trailerForEdit: any= '';
  public delete_id: any = '';
  public parrentComponent = "trailers";
  public validForm = false;
  public emptyForm = true;
  public dirtyForm = false;
  public errorMessage: string;

  private companyTrailersRadioButton = true;
  private clientTrailersRadioButton = false;
  private allTrailersRadioButton = false;

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

    this.trailers = [];
    this.companyTrailers = [];
    this.clientTrailers = [];
    this.allTrailers = [];

    this.companyTrailersRadioButton = true;
    this.clientTrailersRadioButton = false;
    this.allTrailersRadioButton = false;
    
    this.validForm = false;
    this.emptyForm = true;  
    this.dirtyForm = false;

    this.dataService.getTrailers().subscribe(data => {
      
      this.allTrailers = data;
      data.forEach((e, index) => { 
        if(e.company_trailer) {
          this.companyTrailers.push(e);
        } else {
          this.clientTrailers.push(e);
        }
      })
      this.trailers = this.companyTrailers;

    },
    err => {
      this.router.navigate(['/login']);
    });

    //document.getElementById('alert-message').style.display = 'none';
    //document.getElementById('alert-message2').style.display = 'none';
  }

  resetDriverNewFields() {
    this.form.reset();
    // (<HTMLInputElement>document.getElementById('registration_number')).value = '';
    // (<HTMLInputElement>document.getElementById('length')).value = '';
    // (<HTMLInputElement>document.getElementById('capacity')).value = '';
    // (<HTMLInputElement>document.getElementById('height')).value = '';
  }

  editClicked(event) {
    // if(this.allTrailersRadioButton) {
    //   this.trailerForEdit = this.trailers[event.i];
    // } else if(this.companyTrailersRadioButton) {
    //   this.trailerForEdit = this.companyTrailers[event.i];
    // } else {
    //   this.trailerForEdit = this.clientTrailers[event.i];
    // }

    this.trailerForEdit = event.dataUnit;

    if(this.trailerForEdit.company_trailer) {
      this.trailerForEdit.company_trailer = 'true';
    } else {
      this.trailerForEdit.company_trailer = 'false';
    }

    let element: HTMLElement = document.getElementById('trailersModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(event) {

    // if(this.allTrailersRadioButton) {
    //   this.delete_id = this.trailers[event.i].id;
    // } else if (this.companyTrailersRadioButton) {
    //   this.delete_id = this.companyTrailers[event.i].id;
    // } else {
    //   this.delete_id = this.clientTrailers[event.i].id;
    // }

    this.delete_id = event.dataUnit.id;

    this.dataService.canDeleteTrilaer(this.delete_id).subscribe(data => {
      if(data.response == 'true') {
        let element: HTMLElement = document.getElementById('trailersModalDeleteButton') as HTMLElement;
        element.click();
      } else {
        this.validForm = false;
        this.dirtyForm = true;
        this.errorMessage = "Can't delete trailer. Already connected to some tour";
      }
    })

    
    
  }

  saveTrailer(registration_number, ldm, weight, height) {
    
    this.dirtyForm = true;
    if(registration_number ==''|| registration_number== null || ldm == '' || ldm == null || weight =='' || weight == null || height == '' || height == null){
      // Show Error
      this.validForm = false;
      this.errorMessage = 'Error';
      //document.getElementById('alert-message').style.display = 'block';

      console.log('form is not valid');
    } else {
      this.validForm = true;
      this.emptyForm = false;
      let company_trailer = 'true';
      // Add new Trailer
      this.dataService.saveTrailer({ 
        registration_number, 
        ldm, 
        weight, 
        height,
        company_trailer
      } as Trailer).subscribe (() => {
        //console.log('form is valid');
        // Show success message
        //document.getElementById('alert-message2').style.display = 'block';
        //document.getElementById('alert-message').style.display = 'none';

        setTimeout(() => {
          this.resetDriverNewFields();
          this.ngOnInit();
        }, 1500);
        
      })
    }
  }

  updateTrailer(id, registration_number, ldm, weight, height) {
    let company_trailer = '';
    this.dataService.updateTrailer(
      {id, registration_number, ldm, weight, height, company_trailer} as Trailer).subscribe
      (() => {this.ngOnInit(); })
  }

  deleteTrailer() {
    this.dataService.deleteTrailer(this.delete_id).subscribe(() => {
        this.ngOnInit();
      })
  }

  errorAlertClicked() {
    this.dirtyForm = false;
  }

  successAlertClicked() {
    this.emptyForm = true;
  } 

  private chooseCompanyTrailers(value: string) {

    this.companyTrailersRadioButton = true;
    this.clientTrailersRadioButton = false;
    this.allTrailersRadioButton = false;
    this.trailers = [];
    this.trailers = this.companyTrailers;
  }

  private chooseClientTrailers(value: string) {
    
    this.clientTrailersRadioButton = true;
    this.companyTrailersRadioButton = false;
    this.allTrailersRadioButton = false;
    this.trailers = [];
    this.trailers = this.clientTrailers;
  }

  private chooseAllTrailers(value: string) {
    
    this.allTrailersRadioButton = true;
    this.clientTrailersRadioButton = false;
    this.companyTrailersRadioButton = false;
    this.trailers = [];
    this.trailers = this.allTrailers;
  }

}
