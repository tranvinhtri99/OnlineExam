import {JsonObject, JsonProperty} from "typescript-json-serializer";
import { Account } from "../account-models/account";

@JsonObject()
export class LoginResponse{
  @JsonProperty() public token?:string;
  @JsonProperty({type:Account}) public account?:Account;
}
