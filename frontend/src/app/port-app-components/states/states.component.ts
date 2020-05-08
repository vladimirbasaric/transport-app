import { Component, OnInit } from '@angular/core';
import { State } from '../../port-app-models/State';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {



  public states: State[];
  public columnNames = ['#','State', 'Flag']
  public keys = ['state', 'flag']

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.dataService.getStates().subscribe(data => {
      console.log(data);
      this.states = data;
      },
      err => {
        this.router.navigate(['/login']);
      });
  }

}
