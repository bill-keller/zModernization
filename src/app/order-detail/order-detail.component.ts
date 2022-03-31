import { Component, OnInit, Input } from '@angular/core';
import { Phone } from '../phone.model';
import { PhonesService } from '../phones.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @Input() phone: Phone;
  quantity = '';

  constructor(
    private phonesService: PhonesService
  ) { }

  ngOnInit(): void {
  }

  onQuantityEntered(value: string) {

    this.quantity = value;
  }

  onButtonClick() {

    console.log("itemID:"+this.phone.itemID+" quantity:"+this.quantity);
    this.phonesService.orderPhone(this.phone.itemID, this.quantity).subscribe((response) => {
      console.log(response);
    })
  }

}
