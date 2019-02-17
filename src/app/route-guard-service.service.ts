import { Injectable } from '@angular/core';

import { CanActivate ,ActivatedRouteSnapshot,Router, Route} from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies'

@Injectable({
  providedIn: 'root'
})
export class RouteGuardServiceService implements CanActivate{

  constructor(private router : Router) { 

  }

  canActivate(route: ActivatedRouteSnapshot) : boolean {
    //console.log("In Guard Route Service...");
    //console.log(Cookie.get('authToken'));
    
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {
      this.router.navigate(['/user/login']);
      return false;
    }
    else {
      return true;
    }
  }

}