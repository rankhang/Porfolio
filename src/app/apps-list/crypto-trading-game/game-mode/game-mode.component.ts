import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import {doc, getFirestore, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { NgToastService } from 'ng-angular-popup';


@Component({
  selector: 'app-game-mode',
  templateUrl: './game-mode.component.html',
  styleUrls: ['./game-mode.component.css']
})
export class GameModeComponent implements OnInit {
  gameMode: number = 1
  balance : number = 0
  modeString: string = "";
  isLoading = false;
  constructor(private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
  }
  async onGameModeSubmit(){
    this.isLoading = true;
    if(this.gameMode == 1){
      this.balance = 100000;
      this.modeString = "Easy"
    }else if(this.gameMode == 2){
      this.balance = 10000;
      this.modeString = "Medium"
    }else{
      this.balance = 1000;
      this.modeString = "Hard"
    }
    const auth = getAuth();
    const db = getFirestore(initializeFirebase.initialize());
    const user = auth.currentUser;
    try{
      const docRef = await updateDoc(doc(db, "User", user!.uid),{
      accountBalance: this.balance,
      mode: this.modeString
      });
      this.isLoading = false;
      this.toast.success({detail:"Create Account Succeeded",summary:"Please log in to start.", duration:3000})
      this.router.navigate(['appsList/cryptoCurrencyGame/home']);
    }catch(e){
      this.isLoading = false;
      this.toast.error({detail:"Error",summary:"Please try again", duration:2000})
    }
    

    
  }


  onSelected(value: string){
    this.gameMode = parseInt(value);
  }

}
