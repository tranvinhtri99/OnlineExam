import { ApiService } from '../../common/baseServices/apiService';
import {Component, OnInit} from '@angular/core';
import { LoginModel as LoginModel } from 'src/app/models/authenticationModes/loginModel';
import {AuthenticationService} from "../../services/authentication.service";
import {LoginResponse} from "../../models/responses/loginResponse";
import {LoginStore} from "../../common/baseServices/login-store";
import {Router} from "@angular/router";
import {KEY_TOKEN_LOCALSTORAGE} from "../../common/constants/GlobalConstants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  public error: string | null = null;
  public model: LoginModel = new LoginModel();

  private stringJson:string = "";
  private stringObject:any;

  public constructor(private service: AuthenticationService, private loginStore:LoginStore, private router:Router) {}

  ngOnInit():void {
    if (this.loginStore.state != null){
      this.router.navigate([""])
    }
  }

  submit() {
    this.service.Login(this.model).then((response: LoginResponse|null) => {
      if (response == null){
        this.error = "Username or password incorrect";
      }else{
        this.loginStore.signIn(response);
        localStorage.setItem(KEY_TOKEN_LOCALSTORAGE, response.token ?? "");
        this.router.navigate([""]);
      }
    });
  }
}
