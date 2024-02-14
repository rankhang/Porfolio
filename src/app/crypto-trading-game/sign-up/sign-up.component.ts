import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, Auth, getAdditionalUserInfo, UserCredential } from "firebase/auth";
import { addDoc, collection, doc, DocumentData, DocumentReference, getFirestore, setDoc } from 'firebase/firestore';
import { CoinService } from 'src/app/coin.service';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { GenerateRandomNum } from 'src/app/generate-random-number.service';
import { Coins } from 'src/app/models/coins.model';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { User } from 'src/app/models/users.model';
import { Name } from 'src/app/name';
import { WalletService } from 'src/app/wallet.service';
import { PasswordValidator } from './PasswordValidator';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../crypto-trading-game.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm : FormGroup;
  aUser!: User;
  errorCode: string = "";
  errorMessage: string = "";
  route: Router;
  isLoading = false;
  

  constructor(fb: FormBuilder, route: Router, private toast: NgToastService) {
    this.route = route;

    this.signUpForm = fb.group({
      'email' : ['', Validators.compose([Validators.required, Validators.email])],
      'lname' :['', Validators.required],
      'fname' : ['', Validators.required],
      'password' : ['', Validators.compose([Validators.required, Validators.min(6)])],
      'retype-password' : ['', Validators.compose([Validators.required, Validators.min(6)])]
    }
    ,{
      validators: PasswordValidator.passwordMatchValidator 
    }
    );
  }

  ngOnInit(): void {
  }

  async onSignUpSubmit(form: FormGroup){
    
    this.isLoading = true;
    if(this.signUpForm.valid){
      const auth = getAuth();
      //create an user object
      
      this.aUser = new User(form.value.email,form.value.fname,form.value.lname, new Date());
      await this.createAccount(auth,form.value.email, form.value.password);
    }
    
  }



  async createAccount(auth: Auth, email:string, password: string){
    await createUserWithEmailAndPassword(auth,email,password)
    .then( (userCredential)=>{
      let user =  userCredential.user;
      const db = getFirestore(initializeFirebase.initialize());
      this.writeNewUserToDB(this.aUser,userCredential, db);
       this.writeInitialCoinDataToDB(db, userCredential);
       this.route.navigate(['game/game-mode'])
    }).catch((error) => {
      if(error == "FirebaseError: Firebase: Error (auth/email-already-in-use)."){
        this.toast.error({detail:"Email already in use", summary:"Please try later.", duration:10000})
      }else{
        this.toast.error({detail:"Create Account Failed, \n" + error, summary:"Please try later.", duration:10000})
      }
      
      
      this.isLoading = false;
    })
  }


  async writeNewUserToDB(newUser: User, userCredential: UserCredential,  db: Firestore){
      try{
        let user =  userCredential.user;
        const docRef = await setDoc(doc(db, "User", user.uid),{
          fname: newUser.fname,
          lname: newUser.lname,
          email: newUser.email,
          joinedDate: newUser.joinedDate,
          gameDay: 1,
          gameMonth: 1,
          gameYear: 2022,
          gameHour: 0,
          gameMinute: 0,
          gameSecond: 0,
          profilePic: ''
        });

        //Write  user score
        await setDoc(doc(db, "UsersScore", user!.uid),{
          score: 0,
          name: newUser.lname + " " + newUser.fname,
          joinedDate: newUser.joinedDate
        })

      }catch(e){
        this.toast.error({detail:"Error", summary:"Write to data failed. \n" + e , duration:2000})
        this.isLoading = false;
      }
  }


  async writeInitialCoinDataToDB(db: Firestore, userCredential: UserCredential ){
    try{
      const userColRef = collection(db, "User");
      const userDocRef = doc(userColRef, userCredential.user.uid);
      
      

      
      //Write coin data to database
      for(let i = 0; i < CoinService.coinName.length; i++){ 

        
        let aCoin = new Coins(CoinService.coinName[i],CoinService.coinValue[i]);
        
        aCoin.valueLast365Days[0] = aCoin.price;

        for(let day = 1 ; day < 368; day++){ // always make sure the value of the next day generated based on the price of the previous day
          aCoin.valueLast365Days[day] = GenerateRandomNum.getRandomNumBasedOnAnInt(aCoin.valueLast365Days[day-1], GenerateRandomNum.TRIPLE_MODE);
        }
        

        //Generate initial first 24 hours price for a coin
        for(let hour = 0; hour < 24; hour++){
          aCoin.last24HoursValue[hour] = GenerateRandomNum.getRandomNumBasedOnAnInt(aCoin.valueLast365Days[365-1], GenerateRandomNum.SINGLE_MODE);
        }

        //Create average value for each month
        let year = 2021;
        let dayPointer = 366; // keep track the day
        
        for(let m = 12 ; m > 0; m--){
          let monthAverage = 0;
          let daysOfAMonth = new Date(year, m, 0).getDate();

          for(let day = 1; day <= daysOfAMonth; day++){
            monthAverage += aCoin.valueLast365Days[dayPointer-day];
          }

          monthAverage /= daysOfAMonth;

          aCoin.valueAYear.unshift(monthAverage);
          dayPointer -= daysOfAMonth;
        }
       



        await setDoc(doc(userDocRef, "Coins", CoinService.coinName[i]),{
          name: aCoin.name,
          initialPrice: aCoin.price,
          last24HoursValue: aCoin.last24HoursValue,
          valueLast365Days: aCoin.valueLast365Days,
          valueAYear: aCoin.valueAYear
        });


        
      }
      for(let walletIndex = 0; walletIndex < WalletService.walletName.length; walletIndex++){
        
        let ownedWallet = new OwnedWallet(WalletService.walletName[walletIndex], 0, [], false, 0,"",0)

        //Exchange wallet is provided
        if(ownedWallet.walletName == Name.ExchangeWallet){
          ownedWallet.isPurchased = true;
        }



        //Set up wallets to database
        await setDoc(doc(userDocRef, "Wallets", WalletService.walletName[walletIndex]),{
          currentCapacity: ownedWallet.currentCapacity,
          coinsContent: ownedWallet.coinsContent,
          isPurchased: ownedWallet.isPurchased,
          balance: 0,
          addressId: this.makeid(30),
          maxCap: WalletService.capacity[walletIndex]
        }).then(()=>{
          this.isLoading = false;
        });
      }
      
      

      
      
    }catch(e){
      console.error("Error adding Coin: ", e);
      this.isLoading = false;
      this.toast.error({detail:"Error", duration: 2000})
    }
  }


   makeid(length:number) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
  } 



  
}