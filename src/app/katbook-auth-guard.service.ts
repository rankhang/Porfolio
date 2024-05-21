import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, first, map, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable()
export class AuthGuardKatbook implements CanActivate{

    constructor(private _fAuth: AngularFireAuth, private authService: AuthService,
                private router: Router){

    }

    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot)
                : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
                     
                    
                    
        

        
                    
        
        
        if(sessionStorage.getItem('isLoggedIn')){
            console.log("already loggedin");
            
            return true;
        }
        else{
            this.router.navigate(['appsList/katbook/sign-in'])
            return false;
        }
    }

}