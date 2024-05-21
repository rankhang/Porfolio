import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Data, Router } from '@angular/router';
import { User, getAuth } from 'firebase/auth';
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseApp } from '@angular/fire/app';
import { MainUser } from '../models/MainUser';
import { GetUserMetaDataService } from 'src/app/firebase/get-main-user-data.service';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';


@Component({
  selector: 'app-katbook-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class KatBookHomepageComponent implements OnInit {
  route: Router | undefined;
  db: Firestore
  auth: Auth
  user: User | null
  firebaseApp: FirebaseApp;
  mainUser?: MainUser ;





  constructor(route: Router) {
    this.firebaseApp = initializeFirebase.initialize();
    this.db = getFirestore(this.firebaseApp);
    this.auth = getAuth();
    this.user = this.auth.currentUser;
    console.log("RUnning again");
    

    
    this.route = route;
  }



  ngOnInit(): void {
    GetUserMetaDataService.getUserData(this.user, this.db).then((user) => {
      this.mainUser = user;
    })
  }



  onClickToProfilePage() {
    this.route?.navigate(["appsList/katbook/profile/", this.mainUser?.fname! + this.mainUser?.lname! + "/" + this.mainUser?.uid]);
  }



}
