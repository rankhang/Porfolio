import { Auth, getAuth } from "firebase/auth";
import { collection, doc, Firestore, getFirestore, updateDoc } from "firebase/firestore";
import { initializeFirebase } from "./firebase/initialize-firebase";

export class SaveGameService{
    
    static async saveAccountBalance(db: Firestore, auth: Auth, accountBalance: number){
        
        let user = auth.currentUser;
            try{
              if(user){
                //Save coin data
                    const userColRef = collection(db, "User");
                    const userDocRef = doc(userColRef, user.uid);
                    
                    
                  //Save account balance to database
                  await updateDoc(userDocRef,{
                    accountBalance: accountBalance
                  });
                console.log("Saved game");
              }else{
                console.log("Can not get current user");
              }
            }catch(e){
              console.error("Error adding User data: ", e);
            }   
    }
}   