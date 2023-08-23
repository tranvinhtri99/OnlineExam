import { BaseResponse } from './../baseResponses/baseResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_API } from '../constants/GlobalConstants';
import {JsonSerializer} from 'typescript-json-serializer';
import {map} from "rxjs/operators";
import {LoginResponse} from "../../models/responses/loginResponse";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public constructor(
    public client: HttpClient,
    public jsonSerializer: JsonSerializer
  ) {}

  public get<T>(url: String) {
    this.client.get(URL_API + url).subscribe((data) => {
      const response = this.jsonSerializer.deserializeObject<BaseResponse<T>>(
        data.toString(),
        new BaseResponse<T>()
      );
      if (response?.error != null) {
        // TODO: Show messagebox error
      }
      return response?.data;
    });
  }

  // public post<T>(url: String, data: any): Promise<BaseResponse<T> | null | undefined> {
  //   try {
  //     const observableData = this.client.post(URL_API + url, data)
  //       .pipe(
  //         map((x:object) => {
  //           const response =  this.jsonSerializer.deserializeObject<BaseResponse<T>>(x, new BaseResponse<T>());
  //
  //           const responseAssign = new BaseResponse<T>();
  //           Object.assign(responseAssign, x);
  //
  //
  //
  //           debugger;
  //           return response;
  //         })
  //       );
  //     if (observableData != null){
  //       return observableData.toPromise();
  //     }
  //   }catch (e) {
  //     console.error(e)
  //   }
  //   throw new Error('Valid token not returned');
  // }

  public post<T>(url: String, data: any): Promise<BaseResponse<LoginResponse> | null | undefined> {
    try {
      const observableData = this.client.post<BaseResponse<LoginResponse>>(URL_API + url, data)
        .pipe(
          map((x) => {
            // const response =  this.jsonSerializer.deserializeObject<BaseResponse<LoginResponse>>(x, new BaseResponse<T>());

            const responseAssign = new BaseResponse<LoginResponse>();
            Object.assign(responseAssign, x);

            responseAssign.data = responseAssign.data as LoginResponse;


            debugger;
            return responseAssign;
          })
        );
      if (observableData != null){
        return observableData.toPromise();
      }
    }catch (e) {
      console.error(e)
    }
    throw new Error('Valid token not returned');
  }

  // public post<T>(url: String, data: any): Promise<BaseResponse<T> | null | undefined> {
  //   try {
  //     const observableData = this.client.post<BaseResponse<T>>(URL_API + url, data);
  //     if (observableData != null){
  //       return observableData.toPromise();
  //     }
  //   }catch (e) {
  //     console.error(e)
  //   }
  //   throw new Error('Valid token not returned');
  // }

  public put<T>(url: String, data: any) {
    this.client.put(URL_API + url, data).subscribe((data) => {
      const response = this.jsonSerializer.deserializeObject<BaseResponse<T>>(
        data.toString(),
        new BaseResponse<T>()
      );
      if (response?.error != null) {
        // TODO: Show messagebox error
      }
      return response?.data;
    });
  }

  public delete<T>(url: String) {
    this.client.delete(URL_API + url).subscribe((data) => {
      const response = this.jsonSerializer.deserializeObject<BaseResponse<T>>(
        data.toString(),
        new BaseResponse<T>()
      );
      if (response?.error != null) {
        // TODO: Show messagebox error
      }
      return response?.data;
    });
  }
}
