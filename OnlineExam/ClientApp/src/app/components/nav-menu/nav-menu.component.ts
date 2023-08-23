import { Component } from '@angular/core';
import {LoginStore, typeAccountCurrent} from "../../common/baseServices/login-store";
import {Router} from "@angular/router";
import {KEY_TOKEN_LOCALSTORAGE} from "../../common/constants/GlobalConstants";
import {convertTypeAccount, TypeAccount} from "../../models/account-models/create-account-model";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  public logined = false;
  public typeAccount?: TypeAccount;

  constructor(
    private authStore: LoginStore,
    private router:Router
  ) {
    authStore.state$.subscribe(x => {
      this.logined = x != null;
      this.typeAccount = convertTypeAccount(x?.account?.type ?? "");
    })


  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  signOut(){
    localStorage.removeItem(KEY_TOKEN_LOCALSTORAGE);
    this.authStore.signOut();
    this.router.navigate(["/signIn"])
  }
}
