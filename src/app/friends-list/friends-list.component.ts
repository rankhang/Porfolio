import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDocs, getFirestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { friend } from '../contact/add-friend/friend.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  friends: friend[] = [];
  db: Firestore;
  isClickedAddMe = false;
  

  

  constructor() {
    
    
    //Initialize firestore database
    this.db = getFirestore(initializeFirebase.initialize());
    this.getData();
  }

  ngOnInit(): void {
  }

  async getData(){
    const querySnapshot = await getDocs(collection(this.db, "friends"));
    querySnapshot.forEach((doc) => {
      //put all data to friends list
      const aFriend = new friend( 
                            doc.get('email'), 
                            doc.get('first'),
                            doc.get('last'),
                            doc.get('message'));
      this.friends.push(aFriend);
    });
  }

  onClickAddMe(){
    this.isClickedAddMe = true;
  }

}
