import { Component, OnInit, ViewChild } from '@angular/core';
import { City } from '../../port-app-models/City';
import { DataService } from '../../services/data.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { State } from '../../port-app-models/State';
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})

export class CitiesComponent implements OnInit {

  @ViewChild('largeModal', {static: false}) public largeModal: ModalDirective;
  @ViewChild('largeModalDelete', {static: false}) public largeModalDelete: ModalDirective;
  @ViewChild('formDirective', {static: false})form: any;

  public city: City = {
    id: '',
    city: '',
    state: '',
    flag: ''
  }

  public cities: City[];
  public states: State[];
  public columnNames = ['#','City', 'Country', 'Flag', 'Edit', 'Delete']
  public keys = ['city', 'state', 'flag']
  public cityForEdit: any= '';
  public delete_id: any = '';
  selectedStateId: any = '';

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

  editClicked(event) {
    //this.cityForEdit = this.cities[event.i];
    this.cityForEdit = event.dataUnit as City;
    let element: HTMLElement = document.getElementById('cityModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(event) {
    //this.delete_id = this.cities[event.i].id;
    this.delete_id = event.dataUnit.id;
    let element: HTMLElement = document.getElementById('cityModalDeleteButton') as HTMLElement;
    element.click();
  }

  ngOnInit() {
    this.dataService.getStates().subscribe(
      
      data => {
        console.log(data);
        this.states = data;
      },
      err => {
        this.router.navigate(['/login']);
      });
    this.dataService.getCities().subscribe(data => {
      console.log(data);

      this.cities = [];
      data.forEach((e, index) => { 

        if(e.state) {
          this.cities.push({id:e.id, city:e.city, state:e.state.state, flag:e.state.flag});
        }
      })
      //this.cities = data;
      });
      document.getElementById('alert-message').style.display = 'none';
      document.getElementById('alert-message2').style.display = 'none';
  }

  resetDriverNewFields() {
    this.form.reset();
  }

  saveCity(city: string) {
    
    if(city == '' || city == null){
     // Show Error
    document.getElementById('alert-message').style.display = 'block';
    
     console.log('form is not valid');
   } else {
     // Add new city
     this.dataService.saveCity({ city } as City, this.selectedStateId).subscribe (() => {
       console.log('form is valid');
       // Show success message
       document.getElementById('alert-message2').style.display = 'block';
       document.getElementById('alert-message').style.display = 'none';

       setTimeout(() => {
         this.ngOnInit();
       }, 1500);
       
     })
   }
   this.resetDriverNewFields();


    // console.log('selectedStateId::'+ this.selectedStateId)
    // this.dataService.saveCity({city} as City, this.selectedStateId).subscribe(() => {
    //   this.ngOnInit();
    // })
  }

  updateCity(id, city) {
    this.dataService.updateCity(
      {id, city} as City).subscribe
      (() => {this.ngOnInit(); })
  }

  deleteCity() {
    this.dataService.deleteCity(this.delete_id).subscribe(() => {
        this.ngOnInit();
      })
  }
}
