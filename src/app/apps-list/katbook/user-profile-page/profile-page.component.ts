import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';



import { KatBookHomepageComponent } from '../homepage/homepage.component';
import { MainUser } from '../models/MainUser';
import { StorageReference } from 'firebase/storage';
import { uploadPhotoService } from 'src/app/photo-upload.service';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { Auth, User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { NgToastService } from 'ng-angular-popup';
import { getFirestore } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { GetUserMetaDataService } from 'src/app/firebase/get-main-user-data.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css', '../homepage/homepage.component.css']
})
export class UserProfilePageComponent implements OnInit {
  firebaseApp!: FirebaseApp;
  mainUserMetaData?: MainUser ;
  isUploadNewProfilePic = false;
  imagePath: any;
  storageRef!: StorageReference;
  isLoading = false;
  user: User | null;
  auth?: Auth;
  db!: Firestore ;

  constructor(private toast: NgToastService) {

    this.firebaseApp = initializeFirebase.initialize();
    this.auth = getAuth();
    this.user = this.auth.currentUser;
    this.db = getFirestore(this.firebaseApp);
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        this.user = user;
      } else {
        // User is signed out
        // ...
      }
    });
  }
 
  
  ngOnInit(): void {
    GetUserMetaDataService.getUserData(this.user, this.db).then((data) => {
      this.mainUserMetaData = data;
    });
  }

  //get userData on database when user refresh the page --- because the mainUser data is passed from its parent(katbook homepage component), it will lose the static field when user refresh
  async getUserDataFromDB() {
    
  }


  //Upload new profile pic
  onSelectFile(event: any) {
    this.isLoading = true;
    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = async (event) => { // called once readAsDataURL is completed
      this.imagePath = event.target!.result;
      this.mainUserMetaData?.setProfilePhotoURL(await uploadPhotoService.uploadNewPic(this.firebaseApp, true, this.storageRef, this.user!, this.imagePath, this.toast, this.db));
      this.isLoading = false;

    }


  }





}
