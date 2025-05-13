import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // constructor() { }
private apiUrl = 'http://127.0.0.1:5000/predict_bulk';  // Flask API URL

  constructor(private http: HttpClient) { }

  getBulkLeadScores(leadData: any[]): Observable<any[]> {
    const headers=new HttpHeaders()
    return this.http.post<any[]>(this.apiUrl, leadData,{
      headers:headers
    });
  }
}
