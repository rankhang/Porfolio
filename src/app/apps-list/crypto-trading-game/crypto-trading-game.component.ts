import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth.service';
import { ErrorMessageModalComponent } from '../../error-message-modal/error-message-modal.component';
import { initializeFirebase } from '../../firebase/initialize-firebase';
import { TopScorer } from '../../models/topScorer.model';
import { SignInService } from 'src/app/firebase/SignInService';
import { Name } from 'src/app/name';



@Component({
  selector: 'app-crypto-trading-game',
  templateUrl: './crypto-trading-game.component.html',
  styleUrls: ['./crypto-trading-game.component.css']
})
export class CryptoTradingGameComponent implements OnInit {
  signInForm: FormGroup;
  errorMessage: string= "";
  errorCode: string = "";
  solutionText: string = "";
  isLoggedIn : boolean = false;
  route: Router;
  private db = getFirestore(initializeFirebase.initialize());
  private auth = getAuth();
  private user = this.auth.currentUser;
  isLoading = true;
  version = environment.VERSION
  
  topScorer: TopScorer[] = [];

  constructor(private authService: AuthService, fb: FormBuilder, route: Router, private dialogRef: MatDialog) {
    this.getTopScorerData();
    
    
    if(this.user?.email != null || this.user?.email != undefined || this.isLoggedIn){
      this.isLoggedIn = true;
      route.navigate(['appsList/cryptoCurrencyGame/home']);
    }
    this.route = route;

    this.signInForm = fb.group({
      'email' : ['', Validators.compose([Validators.required, Validators.email])],
      'password' : ['',Validators.required]
    })
   }

  ngOnInit(): void {
  }

   onSignInSubmit(form: FormGroup){
     SignInService.signIn(form ,this.signInForm, this.authService, this.dialogRef, this.route, Name.CRYPTOCURRENCYGAME);
  }

  async getTopScorerData(){
    const topScoreColRef = collection(this.db, "UsersScore");
    try{
      const topScorerSnap = await getDocs(topScoreColRef);
      topScorerSnap.forEach((data)=>{
        const aPlayer = new TopScorer(data.data()['score'],data.data()['name'],new Date(data.data()['joinedDate'].seconds * 1000),data.data()['gameMode']);
        this.topScorer.push(aPlayer);
      });
      //Sort the topScorer array
      
      this.topScorer.sort((a,b) => b.score - a.score);
      
      
      this.isLoading = false;
    }catch(e){
      console.log("Failed to load top scorer " + e);
    }
    
    

  }





  // async signIn(form: FormGroup){
  //   const auth = getAuth();
  //   await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
  //   .then((userCredential) => {
  //     // Signed in 
  //     const user = userCredential.user;
  //     // ...
  //     this.isLoggedIn = true;
    
  //     console.log("Logged In");
  //     this.route.navigate(['game'])
      
  //   })
  //   .catch((error) => {
  //      this.errorCode = error.code;
  //     this.errorMessage = error.message;
  //   });
  // }



  // signOut(){
  //   const auth = getAuth();
  //   signOut(auth).then(() => {
  //     // Sign-out successful.
  //     this.isLoggedIn = false;
  //     this.route.navigate(['game'])
  //   }).catch((error) => {
  //     // An error happened.
  //   });
  // }

}
