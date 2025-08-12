import { Injectable } from '@angular/core';
import { Observable, take, map, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalComponent } from '../global-component';
import { User } from '../models/User';
import { PaginatedResult } from '../models/Pagination';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) { }

  public post(user: User): Observable<any>{
    return this.http.post(GlobalComponent.baseUrl+'User/add', user).pipe(take(1));
  }

  public register(user: User): Observable<any>{
    return this.http.post(GlobalComponent.baseUrl+'User/register', user, {responseType: 'text'}).pipe(take(1));
  }

  public put(user: User): Observable<any>{
    return this.http.put(GlobalComponent.baseUrl+'User/update', user).pipe(take(1));
  }

  public delete(id: number): Observable<any>{
    return this.http.delete(`${GlobalComponent.baseUrl}User/delete?id=${id}`).pipe(take(1));
  }

  public getById(id: number): Observable<User>{
    return this.http.get<User>(`${GlobalComponent.baseUrl}User/getById?id=${id}`).pipe(take(1));
  }

  public getByEmail(email: string): Observable<User>{
    return this.http.get<User>(`${GlobalComponent.baseUrl}User/getByEmail?email=${email}`).pipe(take(1));
  }

  public uploadImage(pathName: string, file: File): Observable<User>{
    const formData = new FormData();
    formData.append('file', file, pathName);
    return this.http.post(`${GlobalComponent.baseUrl}User/uploadImage?pathName=${pathName}`, formData).pipe(take(1));
  }

  //*********************************************************************************************** */
  
  public get( page?: number,
              itemsPerPage?: number,
              term?: string,
              orderField?: string,
              orderReverse?: boolean ): Observable<PaginatedResult<User[]>> 
  {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams;
    if (page !=  null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (term != null && term != ''){
      params = params.append('term', term)
    }
    if (orderField != null && orderField != ''){
      params = params.append('orderField', orderField);
    }
    if (orderReverse != null){
      params = params.append('orderReverse', orderReverse);
    }
    return this.http.get<User[]>(GlobalComponent.baseUrl+'User/get', {observe: 'response', params})
                    .pipe(take(1), map((response) => {
      paginatedResult.result = response.body!;
      if(response.headers.has('Pagination')){
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
      })
    );
  }
  
  public getByAccount(page?: number,
                      itemsPerPage?: number,
                      term?: string,
                      orderField?: string,
                      orderReverse?: boolean ): Observable<PaginatedResult<User[]>> 
  {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams;

    //AccountId from sessionStorage
    let accountId = Number(sessionStorage.getItem('accountId'));
    params = params.append('accountId', accountId);

    if (page !=  null && itemsPerPage != null){
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (term != null && term != ''){
      params = params.append('term', term)
    }
    if (orderField != null && orderField != ''){
      params = params.append('orderField', orderField);
    }
    if (orderReverse != null){
      params = params.append('orderReverse', orderReverse);
    }
    return this.http.get<User[]>(GlobalComponent.baseUrl+'User/getByAccount', {observe: 'response', params})
                    .pipe(take(1), map((response) => {
      paginatedResult.result = response.body!;
      if(response.headers.has('Pagination')){
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
      })
    );
  }

}
