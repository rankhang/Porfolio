import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';


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
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { Post } from '../models/Post';
import { Name } from 'src/app/name';
import { DateStringGenerator } from 'src/app/date.service';
import { Photo } from '../models/Photo';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css', '../homepage/homepage.component.css'],
  

})
export class UserProfilePageComponent implements OnInit {
  formattedDateMethodRef = DateStringGenerator.formatDateService;
  firebaseApp!: FirebaseApp;
  mainUserMetaData?: MainUser;
  isUploadNewProfilePic = false;
  imagePath: any;
  storageRef!: StorageReference;
  isLoading = false;
  user: User | null;
  auth?: Auth;
  db: Firestore;
  posts: Post[] = [];
  postAudienceTemplate = Name.POST_AUDIENCE_TEMPLATE;
  galleryPhotos: Photo[] = [];
  activePhotoGallery: Photo | undefined;
  file: any;

  @ViewChild('photoGallery') photoGallery: ElementRef | undefined;
  constructor(private toast: NgToastService) {
    
    
    DateStringGenerator.formatDateService(new Date(2024,2,9));
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



  async ngOnInit(): Promise<void> {
    //Get user metadata from db
    await GetUserMetaDataService.getUserData(this.user, this.db).then((data) => {
      console.log(this.user?.email);

      this.mainUserMetaData = data;
      if (this.mainUserMetaData.profilePhotoURL != '') {
        this.file = this.mainUserMetaData.profilePhotoURL;
      }
    });

    //Get post from db
    await GetUserMetaDataService.getPosts(this.user, this.db).then((posts) => {
      this.posts = posts;
    });


  }

  //get userData on database when user refresh the page --- because the mainUser data is passed from its parent(katbook homepage component), it will lose the static field when user refresh
  async getUserDataFromDB() {

  }

  onFileChange(event: any) {
    this.isLoading = true;
    const files = event.target.files as FileList;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); // read file as data url

    reader.onload = async (event) => { // called once readAsDataURL is completed
      this.file = event.target!.result;
      this.mainUserMetaData?.setProfilePhotoURL(await uploadPhotoService.uploadNewProfilePic(this.firebaseApp, true, this.storageRef, this.user!, this.file, this.toast, this.db));
      this.isLoading = false;
      this.resetInput();
    }

  }

  onPhotoClick(photo:Photo, photos: Photo[]){
    this.galleryPhotos = photos;
    this.activePhotoGallery = photo;
    console.log(photo.id);
    
    this.photoGallery?.nativeElement.click();
  }

  onGalleryClose(){
    this.galleryPhotos = [];
    this.activePhotoGallery = undefined;
  }


  //Method receive newPost from its child component (create-new-post-modal.component)
  updatePostsEvent(newPost: Post) {
    
    
    this.posts.unshift(newPost); // put new post to top of the array
    
  }

  resetInput() {
    const input = document.getElementById('avatar-input-file') as HTMLInputElement;
    if (input) {
      input.value = "";
    }


  }




}
