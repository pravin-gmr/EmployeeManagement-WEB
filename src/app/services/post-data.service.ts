import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {

  ApiUrl = environment.apiURL;

  constructor(private http: HttpClient) {
  }

  AddUpdateEmployee(data: any) {
    debugger
    const headers = new HttpHeaders().set('content-type', 'application/json')
    let options = { headers: headers };
    return this.http.post(this.ApiUrl + "Employee/AddUpdateEmployee", data, options);
  }

  DeleteEmployee(data: any) {
    const headers = new HttpHeaders().set('content-type', 'application/json')
    let options = { headers: headers };
    return this.http.post(this.ApiUrl + "Employee/DeleteEmployee", data, options);
  }
}
