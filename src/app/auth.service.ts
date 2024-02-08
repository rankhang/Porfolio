import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { browserSessionPersistence, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";

@Injectable()
export class AuthService{
    static isLoggedIn = false;
    errorMessage: string= "";
    errorCode: string = "";
    route: Router | undefined;

    constructor(){
        //this.route = route;
    }

    isAuthenticated(){
        return AuthService.isLoggedIn;
    }


    async signIn(form: FormGroup): Promise<string>{
        
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          // ...
          AuthService.isLoggedIn = true;
        
          
          this.errorMessage = "Logged In Success";
          return  this.errorMessage;
        })
        .catch((error) => {
          this.errorCode = error.code;
          this.errorMessage = error.message;
          return  this.errorMessage;
        });
         return this.errorMessage;;
      }


    async signOut(){
    const auth = getAuth();
    await signOut(auth).then(() => {
        // Sign-out successful.
        AuthService.isLoggedIn = false;
        console.log("Signed out");
        this.route?.navigate(['game'])
    }).catch((error) => {
        // An error happened.
    });
    }
}