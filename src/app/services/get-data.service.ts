import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  ApiUrl = environment.apiURL;

  constructor(private http: HttpClient) {
  }

  GetCountryList() {
    return this.http.get(this.ApiUrl + "Common/GetCountryList");
  }

  GetStateList(CountryId: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json')
    const queryParams = new HttpParams().append("CountryId", CountryId);
    let options = { headers: headers, params: queryParams };

    return this.http.get(this.ApiUrl + "Common/GetStateList", options);
  }

  GetCityList(StateId: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json')
    const queryParams = new HttpParams().append("StateId", StateId);
    let options = { headers: headers, params: queryParams };

    return this.http.get(this.ApiUrl + "Common/GetCityList", options);
  }

  GetAllEmployee() {
    return this.http.get(this.ApiUrl + "Employee/GetAllEmployee");
  }

  GetEmployeeById(EmployeeId: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json')
    const queryParams = new HttpParams().append("EmployeeId", EmployeeId);
    let options = { headers: headers, params: queryParams };

    return this.http.get(this.ApiUrl + "Employee/GetEmployeeById", options);
  }

}
