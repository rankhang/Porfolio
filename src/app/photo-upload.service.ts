import { FirebaseApp } from '@angular/fire/app';
import { StorageReference, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { initializeFirebase } from './firebase/initialize-firebase';
import { MainUser } from './apps-list/katbook/models/MainUser';
import { User, updateProfile } from 'firebase/auth';
import { NgToastService } from 'ng-angular-popup';
import { Name } from './name';
import { Firestore, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { CreateAccountService } from './firebase/createAccountService';
import { Photo } from './apps-list/katbook/models/Photo';
import { Post } from './apps-list/katbook/models/Post';

export class uploadPhotoService {



    static async toastMessage(toast: NgToastService) {
        toast.success({ detail: 'Changed successfully' });
    }

    //Upload profile picture
    static async uploadNewProfilePic(firebaseApp: FirebaseApp, isUploadNewPic: boolean, storageRef: StorageReference, user: User, imagePath: any, toast: NgToastService, db: Firestore) {
        
        let photoURL = "";
        if (isUploadNewPic) {


            const uid = sessionStorage.getItem(Name.USER_ID);
            console.log(uid);

            //save picture to cloud storage
            const storage = getStorage(firebaseApp);

            storageRef = ref(storage, 'katbook/' + uid + user.email + '/profilePicture/');
            try {
                await uploadString(storageRef, imagePath, 'data_url').then((snapshot) => {


                    // Get the download URL
                    getDownloadURL(storageRef)
                        .then(async (url) => {
                            this.toastMessage(toast);
                            photoURL = url;
                            //save profile picture url to database
                            await updateDoc(doc(db, Name.USER, uid!), {
                                profilePic: url
                            });

                            // this.profilePicUrl = url;
                            updateProfile(user, {
                                photoURL: url
                            }).catch((e) => {

                                toast.error({ detail: 'Upload failed' + e });
                            });


                        })
                        .catch((error) => {
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/object-not-found':

                                    break;
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object

                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload

                                    break;
                                case 'storage/unknown':
                                    // Unknown error occurred, inspect the server response

                                    break;
                            }
                        });
                });
            } catch (e) {


                toast.error({ detail: 'Upload failed' + e });
            }
        }
        return photoURL;
    }



    //Upload photo
    static async uploadPhoto(firebaseApp: FirebaseApp,
        user: User, 
        db: Firestore, storagePath: string, 
        newPost: Post, mainUserMetaData: MainUser, compressPhotosArray: any, toast: NgToastService
    ) {
        let photoURLs : Array<string> = [];
        let storageRef: StorageReference;
        

       
        
        //======== Upload photo(s) to cloud storage
        const uid = sessionStorage.getItem(Name.USER_ID);


        //save picture to cloud storage
        const storage = getStorage(firebaseApp);

        
        try {
            for(let i = 0 ; i < compressPhotosArray.length; i++){
                storageRef = ref(storage, storagePath + newPost.photos[i].id);
                await uploadString(storageRef, compressPhotosArray[i], 'data_url').then((snapshot) => {


                    // Get the download URL
                    getDownloadURL(storageRef)
                        .then(async (url) => {
                            this.toastMessage(toast);
                            photoURLs.push(url);
                            newPost.photos[i].url = url;
                        })
                        .catch((error) => {
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case 'storage/object-not-found':
    
                                    break;
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
    
                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
    
                                    break;
                                case 'storage/unknown':
                                    // Unknown error occurred, inspect the server response
    
                                    break;
                            }
                        });
                });
            }
            
        } catch (e) {
            toast.error({ detail: 'Upload failed' + e });
        }


         // ============== Upload new post to DB
         const newPostDocRef = doc(db, Name.USER, mainUserMetaData?.uid!, "Posts", newPost.postID);

         //Set post metadata
         await setDoc(newPostDocRef, {
             postAudience: newPost.postAudience,
             postBody: newPost.body,
             ownerID: mainUserMetaData?.uid!,
             ownerProfileUrl: newPost.ownerProfileURL,
             ownerName: newPost.ownerName,
             postDate: newPost.postDate
         });
 
         //upload photo(s) metadata to DB
         if (newPost.photos != undefined && newPost.photos.length > 0) {
             for (let i = 0; i < newPost.photos.length; i++) {
                 let aPhoto = newPost.photos[i];
                 const photoColRef = collection(newPostDocRef, "Photos");
                 await setDoc(doc(photoColRef, aPhoto.id), {
                     photoDescription: aPhoto.description,
                     date: aPhoto.date,
                     url: aPhoto.url
                 });
             }
         }

        return photoURLs;
    }

}