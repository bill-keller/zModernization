import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

import { Phone } from './phone.model';

@Injectable({
  providedIn: 'root'
})
export class PhonesService {

  constructor(private http: HttpClient) { }

  getPhone(itemID: string) {
    return this.http
      .get<Phone>("http://localhost:3000/api/phones/"+itemID)
      .pipe(
        map(phoneData =>  {
          return phoneData
        })
      )
  }

  getPhones() {
    return this.http
      .get<{ message: string; phones: Phone[]}>("http://localhost:3000/api/phones")
      .pipe(
        map(phonesResponse =>  {
          return phonesResponse.phones
        })
      )
  }

  orderPhone(itemID: string, qty: string) {
    let orderData = {
      itemID: itemID,
      orderQuantity: qty
    }
    console.log("ps1")
    return this.http
    .post<{ returnCode: string, responseMessage: string}> (
      "http://localhost:3000/api/order",
      orderData
    )
  }


}
