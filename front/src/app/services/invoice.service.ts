import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { InvoiceData } from '../models/InvoiceData';
import { GlobalComponent } from '../global-component';

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  public GetInvoices(): Observable<InvoiceData[]>{
    return this.http.get<InvoiceData[]>(`${GlobalComponent.baseUrl}Invoices/GetInvoices`).pipe(take(1));
  }


}
