import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Country } from '../models/Country';
import { GlobalComponent } from '../global-component';

@Injectable({providedIn: 'root'})
export class CountryService {

  constructor(private http: HttpClient) { }

  public getById(id: number): Observable<Country>{
    return this.http.get<Country>(`${GlobalComponent.baseUrl}Country/getById?id=${id}`).pipe(take(1));
  }

  public get(term?: string): Observable<Country[]>{
    return this.http.get<Country[]>(`${GlobalComponent.baseUrl}Country/get?term=${term}`).pipe(take(1));
  }

}
