import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customtable',
  templateUrl: './customtable.component.html',
  styleUrls: ['./customtable.component.scss']
})
export class CustomtableComponent {

  @Input() data: any;
  @Input() columns: any;
  @Input() keys: any;
  
  public p: number = 1;

}
