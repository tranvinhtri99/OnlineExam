import { expressionType } from '@angular/compiler/src/output/output_ast';
import { JsonObject, JsonProperty } from 'typescript-json-serializer';

export enum TypeResponse {
  Success,
  BusinessException,
  ErrorException,
}

@JsonObject()
export class ErrorResponse {
  public Type?: string;
  public Message?: string;
}

@JsonObject()
export class BaseResponse<T> {
  @JsonProperty() public Type?:number;
  @JsonProperty() public data?: T;
  @JsonProperty() public type?: TypeResponse;
  @JsonProperty({ type: ErrorResponse }) public error?: ErrorResponse;
}
