import { User, getAuth } from "firebase/auth";
import { query,Firestore, collection, doc, getDoc, getFirestore, getDocs, QueryDocumentSnapshot, DocumentData, orderBy, limit } from "firebase/firestore";
import { MainUser } from "../apps-list/katbook/models/MainUser";
import { FirebaseApp } from "@angular/fire/app";
import { Name } from "../name";
import { initializeFirebase } from "./initialize-firebase";
import { Post } from "../apps-list/katbook/models/Post";
import { Photo } from "../apps-list/katbook/models/Photo";
import { DateStringGenerator } from "../date.service";





export class GetUserMetaDataService{

    
    
    static async getUserData(user: User|null, db: Firestore){
        const uid = sessionStorage.getItem(Name.USER_ID);
        console.log(uid);

    
        
        const docRef =  doc(db, "User", uid!);
        const dataSnap = await getDoc(docRef);
        const userBasicData = dataSnap.data();
        const userEmail = userBasicData!['email'];
        
        
        const photoURL = userBasicData!['profilePic']
        const currentUser = new MainUser(userEmail, userBasicData!['fname'],userBasicData!['lname'], userBasicData!['joinedDate'],uid!);
        currentUser.setProfilePhotoURL(photoURL!);
        console.log(currentUser.getProfilePhotoURL());
        
        return currentUser;
      }




      static async getPosts(user: User|null, db: Firestore){
        let posts : Post[] = [];
        

        
        const colRef =  collection(db, "User", user?.uid!, "Posts");
        console.log(colRef);
        const q = query(colRef, orderBy("postDate", "desc"), limit(5));
        
        const postSnapshot = await getDocs(q);
        postSnapshot.forEach(async (doc)=>{
          
          
           const photos = await this.getPostPhotos(user, db, doc.id);
          let post = new Post(doc.data()['postDate'].toDate() ,doc.data()['ownerName'],doc.data()['postAudience'],doc.data()['postBody'],
          photos, doc.data()['ownerID'],doc.id,doc.data()['ownerProfileUrl']);
          posts.push(post);
        });
        return posts;
      }

      private static async getPostPhotos(user: User|null, db: Firestore, postID: string){
        let photos : Photo[] = [];
        const colRef =  collection(db, "User", user?.uid!, "Posts", postID, "Photos");
        
        const photosSnapshot = await getDocs(colRef);
        if(!photosSnapshot.empty){
          photosSnapshot.forEach((doc)=>{
            let photo = new Photo(doc.id, doc.data()['photoDescription'], doc.data()['date'], doc.data()['url']);
            photos.push(photo);
          });
        }
        return photos;
      }
}