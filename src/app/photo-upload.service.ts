import { FirebaseApp } from '@angular/fire/app';
import { StorageReference, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { initializeFirebase } from './firebase/initialize-firebase';
import { MainUser } from './apps-list/katbook/models/MainUser';
import { User, updateProfile } from 'firebase/auth';
import { NgToastService } from 'ng-angular-popup';

export class uploadPhotoService {


    static async toastMessage(toast: NgToastService) {
        toast.success({ detail: 'Changed successfully' });
    }


    static async uploadNewPic(firebaseApp: FirebaseApp, isUploadNewPic: boolean, storageRef: StorageReference, user: User, imagePath: any,  toast: NgToastService) {

        if (isUploadNewPic) {
            const storage = getStorage(firebaseApp);

            storageRef = ref(storage, 'katbook/' + user.uid + user.email + '/profilePicture/');
            try {
                await uploadString(storageRef, imagePath, 'data_url').then((snapshot) => {


                    // Get the download URL
                    getDownloadURL(storageRef)
                        .then((url) => {
                            this.toastMessage(toast);
 
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
    }


}