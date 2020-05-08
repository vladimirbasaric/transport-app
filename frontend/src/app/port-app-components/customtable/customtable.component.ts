import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-customtable',
  templateUrl: './customtable.component.html',
  styleUrls: ['./customtable.component.scss']
})
export class CustomtableComponent {

  @Output() clickedItemIndex:EventEmitter<any> = new EventEmitter();
  @Output() clickedItemDelete:EventEmitter<any> = new EventEmitter();
  @Output() clickedLoad:EventEmitter<any> = new EventEmitter();
  @Output() clickedLoadAdd:EventEmitter<any> = new EventEmitter();
  @Output() clickedClosedTour:EventEmitter<any> = new EventEmitter();
  @Output() clickedDeleteTour:EventEmitter<any> = new EventEmitter();

  @Input() data: any;
  @Input() columns: any;
  @Input() keys: any;
  @Input() parrentComponent: any;
  @Input() loadLdmPercentage:any;
  @Input() loadLdmStyles: any;
  //@Input() tourLdmPercentage:any;
  //@Input() tourLdmStyle: any;
  public p: number = 1;
  

  editClicked(i, dataUnit) {
    console.log('dataUnit:'+JSON.stringify(dataUnit));
    console.log(this.data);
    this.clickedItemIndex.emit({i, dataUnit});
  }

  deleteClicked(i, dataUnit) {
    this.clickedItemDelete.emit({i, dataUnit});
  }

  getWidth(i) {
    return this.loadLdmPercentage[i];
  }

  loadClicked(i, dataUnit) {
    return this.clickedLoad.emit({i, dataUnit});
  }

  loadAddClicked(i, dataUnit) {
    return this.clickedLoadAdd.emit({i, dataUnit});
  }

  closeTourClicked(i) {
    return this.clickedClosedTour.emit(i);
  }

  tourDeleteClicked(i, dataUnit) {
    return this.clickedDeleteTour.emit({i, dataUnit});
  }

  // getTourWidth() {
  //   return this.tourLdmPercentage;
  // }

}
