import {JsonObject, JsonProperty} from "typescript-json-serializer";

@JsonObject()
export abstract class BaseDto implements IBaseDto{
  @JsonProperty() public id?:number;
  @JsonProperty() public rowVersion?:number;
}

export interface IBaseDto extends IKeyId, IRowVersion{

}

export interface IKeyId{
  id?:number;
}

export interface IRowVersion{
  rowVersion?:number;
}
