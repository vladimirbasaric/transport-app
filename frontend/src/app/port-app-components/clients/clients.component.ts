import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../port-app-models/Client';
import { DataService } from '../../services/data.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { State } from '../../port-app-models/State';
import { Router } from '@angular/router';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})

export class ClientsComponent implements OnInit {

  @ViewChild('largeModal', {static: false}) public largeModal: ModalDirective;
  @ViewChild('largeModalDelete', {static: false}) public largeModalDelete: ModalDirective;
  @ViewChild('formDirective', {static: false})form: any;

  public client: Client = {
    id: '',
    name: '',
    address: '',
    pib: '',
    main_id: '',
    phone_number: '',
    email: '', 
    forwarder: '',
    state: '',
    additional_contact: ''
  }

  public clients: any[];
  public states: State[];
  public columnNames = ['#','Name', 'Address', 'Pib', 'Main Id', 'Phone number', 'Email', 'Freight forwarder','Other contact', 'Flag','State', 'Edit', 'Delete']
  public keys = ['name', 'address', 'pib', 'main_id', 'phone_number', 'email', 'forwarder', 'additional_contact', 'flag', 'state']
  public clientForEdit: any= '';
  public delete_id: any = '';
  selectedStateId: any = '';
  selectedStateIdForEdit: any = '';
  //public additionalContact: any = '';
  //public additionalContactForEdit: any = '';
  public validForm = false;
  public emptyForm = true;
  public dirtyForm = false;
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

  editClicked(event) {
    //this.clientForEdit = this.clients[event.i];
    this.clientForEdit = event.dataUnit as Client;
    let element: HTMLElement = document.getElementById('clientModalButton') as HTMLElement;
    element.click();
  }

  deleteClicked(event) {
    //this.delete_id = this.clients[event.i].id;
    this.delete_id = event.dataUnit.id;
    this.dataService.canDeleteClient(this.delete_id).subscribe(data => {
      if(data .response == 'true') {
        let element: HTMLElement = document.getElementById('clientModalDeleteButton') as HTMLElement;
        element.click();
      } else {
        this.validForm = false;
        this.dirtyForm = true;
        this.errorMessage = "Can't delete client. Already connected to some tour";
      }
    })

  }

  ngOnInit() {
    this.validForm = false;
    this.emptyForm = true;  
    this.dirtyForm = false;
    this.dataService.getStates().subscribe(data => {
      console.log(data);
      this.states = data;
      });

    this.dataService.getClients().subscribe(
      
      data => {
  
      this.clients = [];
      data.forEach((e, index) => { 
  
        if(e.state) {
          this.clients.push({id:e.id, name:e.name, address:e.address, pib:e.pib, 
            main_id:e.main_id, phone_number:e.phone_number, email:e.email, forwarder: e.forwarder,
            state: e.state.state, flag: e.state.flag, additional_contact: e.additional_contact});
        }
      })
      },
      err => {
        this.router.navigate(['/login']);
      });  
  }

  saveClient(name, address, pib, main_id, phone_number, email, forwarder, additional_contact) {
    //console.log('selectedStateId::'+ this.selectedStateId)
    this.dirtyForm = true;
    if(name ==''|| name== null || address ==''|| address== null || pib ==''|| pib== null || main_id ==''|| main_id == null ||
      phone_number ==''|| phone_number== null || email ==''|| email== null || forwarder ==''|| forwarder== null ||
      additional_contact ==''|| additional_contact == null){

      this.validForm = false;
      this.errorMessage = "Error";

      } else {
        this.validForm = true;
        this.emptyForm = false;

        this.dataService.saveClient({name, address, pib, main_id, phone_number, email, forwarder, additional_contact} as Client, this.selectedStateId).subscribe(() => {
          setTimeout(() => {
            this.resetFields();
            this.ngOnInit();
          }, 1500);
        })
      }
  }

  // saveClient(name, address, pib, main_id, phone_number, email, forwarder, additional_contact) {
  //   console.log('selectedStateId::'+ this.selectedStateId)
  //   this.dataService.saveClient({name, address, pib, main_id, phone_number, email, forwarder, additional_contact} as Client, this.selectedStateId).subscribe(() => {
  //     this.ngOnInit();
  //   })
  // }

  updateClient(id, name, address, pib, main_id, phone_number, email, forwarder, additional_contact) {
    this.dataService.updateClient(
      {id, name, address, pib, main_id, phone_number, email, forwarder, additional_contact} as Client, this.selectedStateIdForEdit).subscribe
      (() => {this.ngOnInit(); })
  }

  deleteClient() {
    this.dataService.deleteClient(this.delete_id).subscribe(() => {
        this.ngOnInit();
      })
  }

  resetFields() {
    this.form.reset();
  }

  errorAlertClicked() {
    this.dirtyForm = false;
  }

  successAlertClicked() {
    this.emptyForm = true;
  } 

}
