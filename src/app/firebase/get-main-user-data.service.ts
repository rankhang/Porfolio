import { User, getAuth } from "firebase/auth";
import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore";
import { MainUser } from "../apps-list/katbook/models/MainUser";
import { FirebaseApp } from "@angular/fire/app";
import { Name } from "../name";
import { initializeFirebase } from "./initialize-firebase";


export class GetUserMetaDataService{

    
    
    static async getUserData(user: User|null, db: Firestore){
        const uid = sessionStorage.getItem(Name.USER_ID);
        console.log(uid);

    
        
        const docRef =  doc(db, "User", uid!);
        const dataSnap = await getDoc(docRef);
        const userBasicData = dataSnap.data();
        const userEmail = user?.email!;
        const photoURL = userBasicData!['profilePic']
        const currentUser = new MainUser(userEmail, userBasicData!['fname'],userBasicData!['lname'], userBasicData!['joinedDate'],uid!);
        currentUser.setProfilePhotoURL(photoURL!);
        console.log(currentUser.getProfilePhotoURL());
        
        return currentUser;
      }
}