import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardKatbook implements CanActivate{

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
            this.router.navigate(['appsList/katbook/sign-in'])
            return false;
        }
    }

}