import { Component, Input, OnInit } from '@angular/core';



import { KatBookHomepageComponent } from '../homepage/homepage.component';
import { MainUser } from '../models/MainUser';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css','../homepage/homepage.component.css']
})
export class UserProfilePageComponent implements OnInit {
  
  userMetaData: MainUser | undefined ;
  
  constructor() {
    this.userMetaData = KatBookHomepageComponent.currentUser;
   }

  ngOnInit(): void {

  }

  

}
