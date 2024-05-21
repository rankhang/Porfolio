import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Name } from "./name";

@Injectable()
export class AuthService {
    static isLoggedIn = false;
    errorMessage: string = "";
    errorCode: string = "";
    router!: Router;

    constructor() {
        //this.route = route;
    }

    isAuthenticated() {
        return AuthService.isLoggedIn;
    }


    async signIn(form: FormGroup): Promise<string> {

        const auth = getAuth();


       
        
        await setPersistence(auth, browserSessionPersistence)
            .then(async () => {

                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                return await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                    AuthService.isLoggedIn = true;
                    sessionStorage.setItem( Name.IS_LOGGED_IN,"true" );
                    sessionStorage.setItem(Name.USER_ID, user.uid);
    
                    this.errorMessage = "Logged In Success";
                    return this.errorMessage;
                })
                .catch((error) => {
                    this.errorCode = error.code;
                    this.errorMessage = error.message;
                    console.log(this.errorMessage);
                    
                    return this.errorMessage;
                });
            })
            .catch((error) => {
                // Handle Errors here.
                 this.errorCode = error.code;
                 this.errorMessage = error.message;
                console.log(this.errorMessage);
                
            });
        // await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
        //     .then((userCredential) => {
        //         // Signed in 


        //         const user = userCredential.user;
        //         // ...
        //         AuthService.isLoggedIn = true;


        //         this.errorMessage = "Logged In Success";
        //         return this.errorMessage;
        //     })
        //     .catch((error) => {
        //         this.errorCode = error.code;
        //         this.errorMessage = error.message;
        //         return this.errorMessage;
        //     });
        return this.errorMessage;;
    }


    async signOut() {
        const auth = getAuth();
        await signOut(auth).then(() => {
            // Sign-out successful.
            AuthService.isLoggedIn = false;
            sessionStorage.clear();
            console.log("Signed out");
            this.router?.navigate(['appsList/cryptoCurrencyGame'])
        }).catch((error) => {
            console.log("Sign Out error : " + error);
        });
    }
}