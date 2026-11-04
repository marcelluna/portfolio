import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ContactRequest, ContactResponse } from '../../model/contact-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public sendMail(request: ContactRequest): Observable<ContactResponse> {
    return this.httpClient.post<ContactResponse>(this.apiUrl, request );
  }
}
