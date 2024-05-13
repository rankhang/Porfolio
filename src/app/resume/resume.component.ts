import { Conditional } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CoinService } from '../coin.service';
import { Coins } from '../models/coins.model';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { Month } from '../models/month.model';
import { GenerateRandomNum } from '../generate-random-number.service';
import { CoinGraphComponent } from '../apps-list/crypto-trading-game/coin-graph/coin-graph.component';
import { limitToFirst } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '../firebase/initialize-firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent {

  
  gameMode: number = 1
  balance : number = 0
  
  
  
 

  constructor() {
   
}

  async onGameModeSubmit(){
    if(this.gameMode == 1){
      this.balance = 100000;
    }else if(this.gameMode == 2){
      this.balance = 10000;
    }else{
      this.balance = 1000;
    }
    const auth = getAuth();
    const db = getFirestore(initializeFirebase.initialize());
    const user = auth.currentUser;
    const docRef = await updateDoc(doc(db, "User", user!.uid),{
      accountBalance: this.balance
    });

  }


  onSelected(value: string){
    this.gameMode = parseInt(value);
  }
  

}
