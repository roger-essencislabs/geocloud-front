import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Invoice } from '../models/Invoice';
import { GlobalComponent } from '../global-component';

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  public GetInvoices(): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${GlobalComponent.baseUrl}Invoices/GetInvoices`).pipe(take(1));
  }


}
