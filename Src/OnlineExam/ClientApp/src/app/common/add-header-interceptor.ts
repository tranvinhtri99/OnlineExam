import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tokenAccount} from "./baseServices/login-store";

export class AddHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (tokenAccount){
      const clonedRequest = req.clone({ headers: req.headers.append('Authorization', 'Bearer ' + tokenAccount) });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
