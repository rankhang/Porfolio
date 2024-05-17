import { FirebaseApp, getApp } from "@angular/fire/app";
import { Firestore } from "@angular/fire/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { environment } from "src/environments/environment";
import { environment } from "src/environments/environment";

export class initializeFirebase{
     
    
    
    //FOR CryptoCurrency game
    // static initialize(): FirebaseApp{
    //     const app = initializeApp(environment.firebase);
    //     return app;
    // }

    static initialize(): FirebaseApp{
        let firebaseApp: FirebaseApp;
        try{
            firebaseApp = getApp();
          }catch(e){
            firebaseApp = initializeApp(environment.firebase);
          }
        return firebaseApp;
    }

    
}