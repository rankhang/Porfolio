import { Component, Input, OnInit } from '@angular/core';



import { KatBookHomepageComponent } from '../homepage/homepage.component';
import { MainUser } from '../models/MainUser';
import { StorageReference } from 'firebase/storage';
import { uploadPhotoService } from 'src/app/photo-upload.service';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, User, getAuth } from 'firebase/auth';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css','../homepage/homepage.component.css']
})
export class UserProfilePageComponent implements OnInit {
  firebaseApp : FirebaseApp;
  mainUserMetaData: MainUser | undefined ;
  isUploadNewPic = false;
  imagePath: any;
  storageRef!:StorageReference;
  isLoading=  false;
  user: User|null;
  auth:Auth;

  constructor(private toast: NgToastService) {
    this.mainUserMetaData = KatBookHomepageComponent.mainUser;
    this.firebaseApp = initializeFirebase.initialize();
    this.auth = getAuth();
    this.user = this.auth.currentUser;
   }

  ngOnInit(): void {

  }

  onSelectFile(event:any){
    this.isLoading = true;
    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

     reader.onload = async (event) => { // called once readAsDataURL is completed
      this.imagePath = event.target!.result;
      await uploadPhotoService.uploadNewPic(this.firebaseApp, true, this.storageRef, this.user!, this.imagePath, this.toast
      );
      this.isLoading = false;
    }
    
    
  }



  

}
