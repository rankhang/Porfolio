import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { collection } from "firebase/firestore";

@Injectable()
export class AuthGuardCrytoCurrencyGame implements CanActivate{

    constructor(private authService: AuthService,
                private router: Router){

    }

    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot)
                : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
                              
        if(this.authService.isAuthenticated()){
            return true;
        }
        else{
            this.router.navigate(['/appsList/cryptoCurrencyGame'])
            return false;
        }
    }

}