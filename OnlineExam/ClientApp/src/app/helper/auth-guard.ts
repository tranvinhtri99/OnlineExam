import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {LoginStore} from "../common/baseServices/login-store";
import {KEY_TOKEN_LOCALSTORAGE, URL_CHECK_TOKEN} from "../common/constants/GlobalConstants";
import {HttpClient} from "@angular/common/http";
import {BaseResponse} from "../common/baseResponses/baseResponse";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {LoginResponse} from "../models/responses/loginResponse";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    public loginStore:LoginStore,
    public client:HttpClient
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>| boolean {
    const login = this.loginStore.state;
    if (login) {
      // authorised so return true
      return true;
    } else {
      const token = localStorage.getItem(KEY_TOKEN_LOCALSTORAGE);
      if (token) {
        try {
          return this.client.get<BaseResponse<LoginResponse>>(URL_CHECK_TOKEN, {headers: {"Authorization": "Bearer " + token}}).pipe(
            map(
              response => {
                if (response && response.data){
                  this.loginStore.signIn(response.data)
                  return true;
                }
                localStorage.removeItem(KEY_TOKEN_LOCALSTORAGE);
                this.router.navigate(['/signIn']);
                return false;
              }
            )
          )
        }catch (e) {
          this.router.navigate(['/signIn']);
          return false;
        }

      }
    }

    this.router.navigate(['/signIn']);
    return false;
  }
}
