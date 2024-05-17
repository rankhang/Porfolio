import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Data, Router } from '@angular/router';
import { User, getAuth } from 'firebase/auth';
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseApp } from '@angular/fire/app';
import { MainUser } from '../models/MainUser';


@Component({
  selector: 'app-katbook-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class KatBookHomepageComponent implements OnInit {
  route:Router | undefined;
  db: Firestore 
  auth:Auth 
  user:User|null 
  firebaseApp!: FirebaseApp;
  static currentUser: MainUser | undefined;
  
  public classRef = KatBookHomepageComponent;
  
  constructor( route:Router) {
    this.db = getFirestore(this.firebaseApp);
    this.auth = getAuth();
    this.user = this.auth.currentUser;
  
    this.getUserData(this.user).then((user)=>{
      KatBookHomepageComponent.currentUser = user;
    })
    this.route = route;
   }



  ngOnInit(): void {
  }

  async getUserData(user: User|null){
    const docRef =  doc(this.db, "User", user!.uid);
    const dataSnap = await getDoc(docRef);
    const userBasicData = dataSnap.data();
    const userEmail = user?.email!;
    const currentUser = new MainUser(userEmail, userBasicData!['fname'],userBasicData!['lname'], userBasicData!['joinedDate'],this.user?.uid);
    return currentUser;
  }

   onClickToProfilePage(){
     this.route?.navigate(["appsList/katbook/profile/", KatBookHomepageComponent.currentUser?.fname! + KatBookHomepageComponent.currentUser?.lname! + "/" +KatBookHomepageComponent.currentUser?.uid]);
  }



}
