import { Injectable } from '@angular/core';
import {ApiService} from "../common/baseServices/apiService";
import {LoginModel} from "../models/authenticationModes/loginModel"
import {URL_API} from "../common/constants/GlobalConstants";
import {LoginResponse} from "../models/responses/loginResponse";
import {HttpClient} from "@angular/common/http";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {LoginStore} from "../common/baseServices/login-store";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private client: HttpClient) { }

  protected get UrlService(){
    return URL_API + "Authentication/";
  }

  public async Login(model: LoginModel):Promise<LoginResponse | null> {
    try {
      const response = await this.client.post<BaseResponse<LoginResponse>>(this.UrlService + "login", model).toPromise();
      if (response.data != null){
        return response.data;
      }
      return  null;
    } catch (e) {
      return null;
    }
  }
}
