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


}
