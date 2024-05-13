import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';
import { StorageReference } from 'firebase/storage';

@Component({
  selector: 'app-game-navbar',
  templateUrl: './game-navbar.component.html',
  styleUrls: ['./game-navbar.component.css']
})
export class GameNavbarComponent implements OnInit , OnChanges{
  @Input() userLastName = "";
  @Input() userFirstName="";
  @Input() gameMode = "";
  @Input() user!: User | null;

  @Input() db!: Firestore 
  @Input() auth!:Auth 

  @Input() firebaseApp!: FirebaseApp
  @Input() profilePicUrl: any;
  @Input() storageRef!:StorageReference;

  modeColorList = ["rgb(45, 161, 123)",
                    "rgb(182, 118, 128)",
                    "rgb(240, 6, 6)"]
  color : string = "";
  constructor() { 
    this.getColorBasedOnMode();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getColorBasedOnMode();
    
  }

  


  getColorBasedOnMode(){
    if(this.gameMode == "Easy"){
      this.color = this.modeColorList[0];
    }else if(this.gameMode == "Medium"){
      this.color = this.modeColorList[1];
    }else{
      this.color = this.modeColorList[2];
    }
  }
  

  ngOnInit(): void {
  }

  logout(){
    let authService = new AuthService();
    authService.signOut();
  }
}
