
import { Conditional } from '@angular/compiler';
import { AfterContentChecked, Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


import {ScrollingModule} from '@angular/cdk/scrolling';

import { MatDialog } from '@angular/material/dialog';

import { limitToFirst } from 'firebase/database';
import { getAuth, signOut, updateProfile, User } from 'firebase/auth';
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { Coins } from 'src/app/models/coins.model';
import { CoinService } from 'src/app/coin.service';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { GenerateRandomNum } from 'src/app/generate-random-number.service';
import { Month } from 'src/app/models/month.model';
import { CoinGraphComponent } from '../coin-graph/coin-graph.component';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { DateStringGenerator } from 'src/app/date.service';
import { ErrorMessageModalComponent } from 'src/app/error-message-modal/error-message-modal.component';
import { OwnedCoin} from 'src/app/models/ownedCoin.model'
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { WalletService } from 'src/app/wallet.service';

import { Subject } from 'rxjs';
import { TransactionModel } from 'src/app/models/transaction.model';
import { environment } from 'src/environments/environment.prod';
import { getApp, initializeApp } from 'firebase/app';
import { SharedService } from 'src/app/shared.service';
import { Subscription } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { InfoText } from 'src/app/info-text';
import { FirebaseApp } from '@angular/fire/app';
import { getDownloadURL, ref, getStorage, StorageReference,  } from 'firebase/storage';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrls: ['./home-game.component.css'],
  
})
export class HomeGameComponent implements OnInit {
  
  calTotalInvestmentEventSubscription: Subscription;

  
  
  selectecCoinIndex = 0
  currentMode = "";
  selectedCoin: Coins = new Coins("",0);
  selected = 'week';
  
  infoText = new InfoText;

  db: Firestore 
  auth:Auth 
  user:User|null 
  profilePicUrl!: string | null | undefined;

  //Day,week,month chart controller
  static  WEEK_CHART = "WEEK_CHART";
  static DAY_CHART = "DAY_CHART";
  static MONTH_CHART = "MONTH_CHART";
  static YEAR_CHART = "YEAR_CHART";
  DAY_OF_A_YEAR = 365;
  chosenChart :string = HomeGameComponent.WEEK_CHART;
  label : string[] = new Array(7);
  
  
  //Game speed control bar fields
  isSingleButtonClicked = false;
  isDoubleButtonClicked = false;
  isTripleButtonClicked = false;
  second: number = 0;
  minute: number = 0;
  hour: number = 0;
  month: number = 1;
  day: number = 1;
  dayString: string = "";
  year: number = 2022;
  last7DaysDayMonthString: string[] = ["","","","","","",""];
  dateString : string = "";
  interval: NodeJS.Timer | undefined;
  accountBalance : number = 0;
  userLastName: string = "";
  userFirstName: string ="";
  gameMode: string = "";

  
  balanceDisplayIndex = 0;
  

  balanceDisplayObjectArray = [
    {
      balanceName: "Cash",
      balance: this.accountBalance
    },
    {
      balanceName: "Exchange Fund",
      balance: 0
    },
    {
      balanceName: "Total",
      balance: 0
    }
  ]
  

  firebaseApp!: FirebaseApp;

 
  isLoading = true;
  
  
  //coinGraphCom : CoinGraphComponent = new CoinGraphComponent();

  
  exchangeWalletInvestmentCurrentlyTotal: number = 0;
  exchangeWalletOriginalInvestment: number = 0;

  coins: Coins[] = [];
  ownedWallets: OwnedWallet[] = [];
  transactions: TransactionModel[] = [];
  transactionSort!: TransactionModel[];

  storageRef!:StorageReference;
  
 @ViewChild(CoinGraphComponent) coinGraph:  CoinGraphComponent | undefined;

  constructor(private route: Router, private dialogRef: MatDialog, private elementRef: ElementRef, private sharedService: SharedService, private toast: NgToastService) {
    this.calTotalInvestmentEventSubscription = this.sharedService.getClickEvent().subscribe(()=>{
      this.getExchangeWalletTotalAndOriginalInvestment();
    });


    
    try{
      this.firebaseApp = getApp();
    }catch(e){
      this.firebaseApp = initializeApp(environment.firebase);
    }
    this.db = getFirestore(this.firebaseApp);
    this.auth = getAuth();
    this.user = this.auth.currentUser;
    
    

    this.getCoinList();
    
    this.getUserData(this.user);
    this.getCoinData(this.user);
    this.getOwnedWallets(this.user);
    this.getAllTransactionData(this.user);
    
   }

   

  ngOnInit(): void {
   
  }

  

  async getAllTransactionData(user: User|null){
    const userColRef = collection(this.db, "User");
    const userDocRef = doc(userColRef, user!.uid);
    
    const transactionColRef = collection(userDocRef, "Transactions");

    const transactionSnap = await getDocs(transactionColRef);
    const transactionData = transactionSnap.docs;
    
    transactionData.forEach((data) =>{
      this.transactions.push(
        new TransactionModel(
          data.get('orderTotal'),
          data.get('day'),
          data.get('month'),
          data.get('year'),
          data.get('coinName'),
          data.get('transactionAmount'),
          data.get('transactionType'),
          data.get('coinPrice'),
          data.get('transactionNumber'),
          data.get('transactionColorControl')
        )
      );

      // this.transactionSort = this.transactions;
    });
  }


  //Get balance array to display on the top left of the game to show all the balances when user  click on that
  getBalanceArray(){
    this.balanceDisplayObjectArray[0].balance = this.accountBalance;
    this.balanceDisplayObjectArray[1].balance = this.ownedWallets[0] == undefined?0:this.ownedWallets[0].balance;
    this.balanceDisplayObjectArray[2].balance =  this.balanceDisplayObjectArray[0].balance +  this.balanceDisplayObjectArray[1].balance
    
  }

  onBalanceDisplayBoardClicked(){
    if(this.balanceDisplayIndex < this.balanceDisplayObjectArray.length - 1){
      this.balanceDisplayIndex++;
      return;
    }
    this.balanceDisplayIndex = 0;
  }


  //Get User data from database
  async getUserData(user: User|null){
    

    const docRef = doc(this.db, "User", user!.uid);
    const dataSnap = await getDoc(docRef);
    const userBasicData = dataSnap.data();
    this.userLastName = userBasicData!['lname'];
    this.userFirstName = userBasicData!['fname']
    this.accountBalance = userBasicData!['accountBalance'];
    this.second = userBasicData!['gameSecond'];
    this.hour = userBasicData!['gameHour'];
    this.minute = userBasicData!['gameMinute'];
    this.month = userBasicData!['gameMonth'];
    this.year = userBasicData!['gameYear'];
    this.day = userBasicData!['gameDay'];
    this.gameMode = userBasicData!['mode'];
    
    
    
    this.dateString = DateStringGenerator.getDateString(this.day,
                                                        this.month,
                                                        this.year,
                                                        this.hour,
                                                        this.minute,
                                                        this.second)
    

   
  }


  //Get Wallet data from database
  async getOwnedWallets(user: User|null){
    
    const docRef = doc(this.db, "User", user!.uid);
    const walletColRef = collection(docRef, "Wallets");

    const basicOwnedWalletInfoSnap = await getDocs(walletColRef);
      //Get all wallet document basic info
      basicOwnedWalletInfoSnap.forEach((doc)=>{ 
          let aWallet = new OwnedWallet(doc.id,doc.data()['currentCapacity'],[],doc.data()['isPurchased'], doc.data()['balance'], doc.data()['addressId'],doc.data()['maxCap'])
          this.ownedWallets.push(aWallet);
      });
      console.log(this.ownedWallets);
      
      let walletNameArraySorted = WalletService.walletName.sort();

      //get all coins contain in 4 wallets
    for(let walletIndex = 0 ; walletIndex < WalletService.walletName.length; walletIndex++){
      const walletDocRef = doc(walletColRef, walletNameArraySorted[walletIndex]);
      const coinsContainColRef = collection(walletDocRef, "CoinsContain")

      let ownedCoins : OwnedCoin[] = [];
      //Get CoinsContain in each wallet first
      try{
        const coinsContain = await getDocs(coinsContainColRef)
        
      coinsContain.forEach((doc)=>{
        let aCoin = new OwnedCoin(doc.data()['coinName'], doc.data()['amount'], doc.data()['totalInvestment'], doc.data()['currentPrice']);
        ownedCoins.push(aCoin);
      });

      }catch(e){
        console.log("Error" + e);
      }


      try{
        this.ownedWallets[walletIndex].coinsContent = ownedCoins;
        await this.getExchangeWalletTotalAndOriginalInvestment();
      }catch(e){
        console.log(e);
        
      }
      
    }

    this.getBalanceArray(); // get balances data
    this.isLoading = false;
 }
    

      
  //Get exchange wallet total investment on coins and Get original investment in exchange wallet
  async getExchangeWalletTotalAndOriginalInvestment(){
    this.exchangeWalletInvestmentCurrentlyTotal = 0;
    this.exchangeWalletOriginalInvestment = 0;
     for(let i = 0; i < (this.ownedWallets[0].coinsContent.length); i++){
      //Get exchange wallet total investment on coins
      this.exchangeWalletInvestmentCurrentlyTotal += this.ownedWallets[0].coinsContent[i].amount * this.ownedWallets[0].coinsContent[i].currentPrice;

      //Get original investment in exchange wallet
      this.exchangeWalletOriginalInvestment += this.ownedWallets[0].coinsContent[i].totalInvestment;
  }


  }

  

    

  //Get coin data from database
  async getCoinData(user: User|null){
    console.log("start get coin data");

      if (user) {
        console.log("UID: " + user.uid);
        
      } else {
      console.log("NOt login");
      
      }
    const docRef = doc(this.db, "User", user!.uid);
    const coinColRef = collection(docRef, "Coins");
    const dataSnap = await getDocs(coinColRef);
    let coinIndex = 0;
     dataSnap.forEach( (doc) =>{
      
      //Get 24 hours data
      for(let hour = 0; hour < doc.data()['last24HoursValue'].length; hour++){
        this.coins[coinIndex].last24HoursValue[hour] =  doc.data()['last24HoursValue'][hour];
      }
      //Get 365 days data
      for(let day = 0 ; day < doc.data()['valueLast365Days'].length; day++){
        this.coins[coinIndex].valueLast365Days[day] = doc.data()['valueLast365Days'][day];
      }

      //Get 12 month data
      for(let day = 0 ; day < doc.data()['valueAYear'].length; day++){
        this.coins[coinIndex].valueAYear[day] = doc.data()['valueAYear'][day];
        
      }
      
      
      coinIndex++;
    });

   //Set Initial coin to show first when the user first log in
    this.selectedCoin = this.coins[0];
    this.update7DayAnd30DayChartAndValueOfTheChart();
    // this.update24HourChartAndValueOfTheChart();
    
    this.coinGraph?.chart?.update();
    console.log("end get coin data");
  }

  getCoinList(){
    for(let i = 0; i < CoinService.coinName.length; i++){
       this.coins.push(new Coins(CoinService.coinName[i], CoinService.coinValue[i]));
    }
  }

/***********************
 * Game speed control
 **********************/
  
  startTime(mode: string){
    let speedNumber = 0;

    //Only pause and save game when user click to another mode when running a mode
    if(this.isSingleButtonClicked == true || this.isDoubleButtonClicked == true || this.isTripleButtonClicked == true){
      this.pauseTime();
    }
    if(mode == "normal"){
      speedNumber = 100;
      
      
      
      
      
      this.isSingleButtonClicked = true;
      this.isDoubleButtonClicked = false;
      this.isTripleButtonClicked = false;
      this.timer(speedNumber, mode);
    }else if(mode == "fast"){
      speedNumber = 1;
      
      //this.pauseTime();
      
      this.isDoubleButtonClicked = true;
      this.isSingleButtonClicked = false;
      this.isTripleButtonClicked = false;
      this.timer(speedNumber, mode);
    }else if(mode == "fastest"){
      if(this.chosenChart != HomeGameComponent.DAY_CHART){
        speedNumber = 100;
        
        //this.pauseTime();
        
        this.isDoubleButtonClicked = false;
        this.isSingleButtonClicked = false;
        this.isTripleButtonClicked = true;
        this.timer(speedNumber, mode);
      }else{
        this.dialogRef.open(ErrorMessageModalComponent,{
          data: {
            errorCode: "Can Not Perform This Action!",
            errorMessage: "You can not choose the fastest play mode when you are in the day chart!",
            errorSolution: "Please pick another chart type!"
          }
        });
      }
      
    }
    
  }


  //Timer for normal and fast mode only ( run based on seconds)
  timer(speedNumber: number, mode: string){
    this.interval = setInterval(() => {
      //normal or fast mode
      if(mode == "normal"){
        this.secondBasedTimer();
        this.hourBasedTimer();
        // this.generateValue(GenerateRandomNum.SINGLE_MODE);
        this.second++ ;
        

        
      }else if(mode == "fast"){
        this.secondBasedTimer();
        this.hourBasedTimer();
        this.second++ ;
        
      }
      //Fastest mode
      else if(mode == "fastest"){
        this.dayChartDataUpdate();
        this.hourBasedTimer();
        this.hour++;
        
      }
      
    }, speedNumber);
  }


  //Second based timer ( for normal and fast mode)
  secondBasedTimer(){

    
    if (this.second  == 60) {
      this.minute++;
      this.second = 0;

      if (this.minute % 60 == 0) {
        this.hour++;
        this.minute = 0;

        this.dayChartDataUpdate();
      
        if(this.chosenChart == HomeGameComponent.DAY_CHART){
          //Update value once per hour
          //this.generateValue(GenerateRandomNum.SINGLE_MODE);
          //Update the coin's value once per hour
          this.coinGraph?.lineChartData.datasets[0].data.shift();
          this.coinGraph?.lineChartData.datasets[0].data.push(this.coins[this.selectecCoinIndex].price);
  
          this.coinGraph?.lineChartData.labels?.shift();
          this.coinGraph?.lineChartData.labels?.push(this.hour);
          this.coinGraph?.chart?.update();
        }
        
        

        if (this.hour == 24) {
          //Set a day value when user in hourly chart to make sure hourly price match with daily price
          this.updateDataAfterADay();

          this.hour = 0;
          this.minute = 0;
          this.second = 0;
          this.day++;
        }
      }
    }
  }

  ////Set a day value when user in hourly chart to make sure hourly price match with daily price
  updateDataAfterADay(){
    for(let i = 0 ; i < this.coins.length; i++){
      this.coins[i].valueLast365Days.shift();
      this.coins[i].valueLast365Days[this.DAY_OF_A_YEAR - 1] = this.coins[i].last24HoursValue[23];
    }
  }

  //Generate for the Day chart when user focus on other charts
  dayChartDataUpdate(){
    this.exchangeWalletInvestmentCurrentlyTotal = 0;
    for(let coinIndex = 0 ; coinIndex < this.coins.length; coinIndex++){
      let dummyPrice = GenerateRandomNum.getRandomNumBasedOnAnInt(this.coins[coinIndex].last24HoursValue[23], GenerateRandomNum.SINGLE_MODE)


      this.coins[coinIndex].last24HoursValue.shift();
      this.coins[coinIndex].last24HoursValue.push(dummyPrice);


      //add the latest price to coin in ownedWallet  ( for exchange component : display the profit for each coin)
      
      for(let coinInOwnWalletIndex =0 ; coinInOwnWalletIndex < this.ownedWallets[0].coinsContent.length; coinInOwnWalletIndex++){
        if(this.ownedWallets[0].coinsContent[coinInOwnWalletIndex].coinName == this.coins[coinIndex].name){
          this.ownedWallets[0].coinsContent[coinInOwnWalletIndex].currentPrice = dummyPrice;
          this.exchangeWalletInvestmentCurrentlyTotal += this.ownedWallets[0].coinsContent[coinInOwnWalletIndex].amount * this.ownedWallets[0].coinsContent[coinInOwnWalletIndex].currentPrice;
        }
      }
    }
  }


  //Hour based timer ( mainly for fastest mode)
  hourBasedTimer(){

    if(this.hour == 24){
      //Set a day value when user in hourly chart to make sure hourly price match with daily price
      this.updateDataAfterADay();
      
      this.hour = 0;
      

      //Update once a day value
      //this.generateValue(GenerateRandomNum.TRIPLE_MODE);      
      if(this.chosenChart == HomeGameComponent.WEEK_CHART || this.chosenChart == HomeGameComponent.MONTH_CHART){
          //Update the coin's value once a day
        this.coinGraph?.lineChartData.datasets[0].data.shift();
        this.coinGraph?.lineChartData.datasets[0].data.push(this.coins[this.selectecCoinIndex].last24HoursValue[23]);

        this.coinGraph?.lineChartData.labels?.shift();
        this.coinGraph?.lineChartData.labels?.push(Month.months[this.month - 1 ] + " " + this.day + ", " + this.year);
      
      }else if(this.chosenChart == HomeGameComponent.YEAR_CHART){
        //ONly update chart once a month when the day is the last day of the month
        console.log("game day " +  this.day);
        
        if(this.day  == new Date(this.year, this.month, 0).getDate()){
          this.calculateAverageValueOfAMonth();
          this.updateYearChart();
        }
        // if(this.day == new Date(this.year, this.month, 0).getDate()){
        //   this.updateYearChart();
        // }
      }

      this.day++;
      this.coinGraph?.chart?.update();

      
      if(this.day > new Date(this.year, this.month, 0).getDate()){
        this.day = 1;
        this.month++;
        if(this.month > 12){
          this.year++;
          this.month = 1;
          this.day = 1;
        }
      }
      
    }

    this.dateString =  DateStringGenerator.getDateString(
                                                        this.day, 
                                                        this.month,
                                                        this.year,
                                                        this.hour,
                                                        this.minute,
                                                        this.second);

  }


  calculateAverageValueOfAMonth(){
    for(let coinIndex = 0 ; coinIndex < this.coins.length; coinIndex++){
      let lastMonth = this.month - 1;
      let tempYear = this.year;
      if(this.month == 1){
        lastMonth = 12;
        tempYear = this.year - 1;
      }
      let lastMonthAverage = 0;
      let lastMonthTotalValue = 0;
      let daysOfLastMonth = new Date(tempYear, lastMonth, 0).getDate();
      for(let day = 1; day <= daysOfLastMonth; day++){
        lastMonthTotalValue += this.coins[coinIndex].valueLast365Days[354 - day];
      }
      lastMonthAverage = lastMonthTotalValue/daysOfLastMonth;

      //remove the first element of the valueAYear array
      this.coins[coinIndex].valueAYear.shift();
      //Push the average value of last month to valueAYear array
      this.coins[coinIndex].valueAYear.push(lastMonthAverage);    
    }

    

  }

  
 
 

  pauseTime(){
    this.isDoubleButtonClicked = false;
    this.isSingleButtonClicked = false;
    this.isTripleButtonClicked = false;
    this.saveGame();
    clearInterval(this.interval);
  }

/***********************
 * END Game speed control
 **********************/


/**********************
 * Genereate a random value of the 12 coins
 **********************/
// generateValue(mode : string){
//   for(let i = 0 ; i < this.coins.length; i++){
//     if(this.chosenChart == HomeGameComponent.WEEK_CHART)
//       this.createCoinValueBasedOnChartType(this.coins[i].valueLast365Days,7, 365, i,mode);
//     else if(this.chosenChart == HomeGameComponent.DAY_CHART)
//       this.createCoinValueBasedOnChartType(this.coins[i].last24HoursValue,24, 24, i,mode);
//     else if(this.chosenChart == HomeGameComponent.MONTH_CHART)
//       this.createCoinValueBasedOnChartType(this.coins[i].valueLast365Days,30, 365, i,mode);
//     else if(this.chosenChart == HomeGameComponent.YEAR_CHART)
//       this.createCoinValueBasedOnChartType(this.coins[i].valueLast365Days,30, 365, i,mode);
//   }
// }

//This method will create a value of a coin based on the type of chart (there are 3 types of chart so far)
// createCoinValueBasedOnChartType(coinValueArray: number[], controlNumber: number, arraySize: number, loopIndex: number, mode: string){
//   const newPrice = GenerateRandomNum.getRandomNumBasedOnAnInt(coinValueArray[arraySize-1], mode);
//   this.coins[loopIndex].price = newPrice;

//   if(coinValueArray.length == arraySize){
//     coinValueArray.shift(); // remove the first element
//   }
//   //Save price of a day to price list
//   coinValueArray.push(this.coins[loopIndex].price);
// }

/*
* Funtion called when a coin is clicked
*/
onCoinClick(coinOrder: number){
  console.log("coin :" + this.coins[coinOrder].name );
  this.selectecCoinIndex = coinOrder;
  
  this.selectedCoin = this.coins[this.selectecCoinIndex];
  console.log(this.selectedCoin);

  if(this.chosenChart == HomeGameComponent.WEEK_CHART){
    this.update7DayAnd30DayChartAndValueOfTheChart();
  }else if(this.chosenChart == HomeGameComponent.DAY_CHART){
    this.update24HourChartAndValueOfTheChart();
  }else if(this.chosenChart == HomeGameComponent.MONTH_CHART){
    this.update7DayAnd30DayChartAndValueOfTheChart();
  }else if(this.chosenChart == HomeGameComponent.YEAR_CHART){
    this.updateYearChart();
  }
  
  
  this.coinGraph?.chart?.update();
}





//Last 24 hours and update data (coin price)
update24HourChartAndValueOfTheChart(){
  this.coinGraph?.changeLabel(this.selectedCoin.name);
    let tempHour = this.hour;



    this.removeDataInChartAndItsLabel();
  for(let hour = 0; hour < 24; hour++){
    
    //update the chart with data
    this.coinGraph?.lineChartData.datasets[0].data.push(this.selectedCoin.last24HoursValue[hour]);
    this.coinGraph?.lineChartData.labels?.unshift(tempHour)

    if(tempHour <= 0){
      tempHour = 24;
    }
    tempHour--;
  }
}


//Get day STRING for the last 7 days and 30 days and update data (coin price)
update7DayAnd30DayChartAndValueOfTheChart(){
  this.coinGraph?.changeLabel(this.selectedCoin.name);



  let lastMonthTotalDays = 0;

  //MAke sure get correct the previous 7 days
  // if(this.day < 6 ){
    lastMonthTotalDays = new Date(this.year, this.month-1, 0).getDate();
  // }
  this.removeDataInChartAndItsLabel();

  let dummyDay = 0;
  let loopControlNum = 0;
  
  if(this.chosenChart == HomeGameComponent.WEEK_CHART) loopControlNum = 7;
  else loopControlNum = 30;
  for(let i = 0 ; i < loopControlNum; i++){

    //update the week chart with data
    if(this.chosenChart == HomeGameComponent.WEEK_CHART)
    this.coinGraph?.lineChartData.datasets[0].data.push(this.selectedCoin.valueLast365Days[this.DAY_OF_A_YEAR - loopControlNum + i]);
    //update the month chart with data
    else
    this.coinGraph?.lineChartData.datasets[0].data.push(this.selectedCoin.valueLast365Days[this.DAY_OF_A_YEAR - loopControlNum + i]);

    //update the day of the chart
    let tempDay = 0;
    let tempYear = this.year;
    let tempMonth = this.month;
    let tempMonthString = "";
    if(this.day - i <= 0){
      tempDay = lastMonthTotalDays - dummyDay;
      tempMonth -= 1;
      dummyDay++;
      
      
      if(this.month == 1){
        tempYear -=1 ;
        tempMonth = 12;
      }
    }else{
      tempDay = this.day - i;
    }
    
    //transfer month day to month string (1 ==> Jan)
    
    tempMonthString = Month.months[tempMonth-1];
    this.coinGraph?.lineChartData.labels?.unshift(tempMonthString + " " + (tempDay) + ", " + tempYear);
    
  }
}

//SET UP DATA FOR YEAR CHART
updateYearChart(){
  let tempMonth = this.month;
  let dayDummy = 365;
  let tempYear = this.year;
  
  //Display previous month if the day of this current month is still not end
  if(this.day != new Date(this.year, this.month, 0).getDate()){
    tempMonth = this.month - 1;
    dayDummy = this.DAY_OF_A_YEAR - this.day;
  }
  
  this.removeDataInChartAndItsLabel();

    for(let monthIndex = 11 ; monthIndex >= 0 ; monthIndex--){
      //Go back the previous year and start month = Dec
      if(tempMonth == 0){
        tempMonth = 12;
        tempYear -= 1;
      }
      // this.coinGraph?.lineChartData.datasets[0].data.unshift(this.selectedCoin.valueLast365Days[dayDummy - 1]);
      this.coinGraph?.lineChartData.datasets[0].data.unshift(this.selectedCoin.valueAYear[monthIndex]);
      console.log("Month: " + Month.months[tempMonth - 1]);
      
      this.coinGraph?.lineChartData.labels?.unshift(Month.months[tempMonth - 1] + " " + tempYear);
      
      tempMonth -= 1;
      // dayDummy = dayDummy - new Date(tempYear, tempMonth, 0).getDate();
      
    }
  
}


//REMOVE ALL THE DATA IN THE CHART
removeDataInChartAndItsLabel(){
  //Pop all the current data in the chart
  while(this.coinGraph?.lineChartData.datasets[0].data.length != 0 ){
    this.coinGraph?.lineChartData.datasets[0].data.pop();
  };
  while(this.coinGraph?.lineChartData.labels?.length != 0 ){
    this.coinGraph?.lineChartData.labels?.pop();
  }
}

//LOG OUT FUNCTION
  async logOut(){
    this.isLoading = true;
    await signOut(this.auth).then(() => {
        // Sign-out successful.
        AuthService.isLoggedIn = false;
        this.isLoading = false;
        this.route.navigate(['game'])
    }).catch((error) => {
        this.toast.error({detail:"Loggout failed"})
    });
  }

  async saveGame(){
    try{
      this.isLoading = true;
      
      if(this.user){
        

        
        //Save game time
        const userDocRef = doc(this.db, "User", this.user.uid);
        // const userColRef = collection(this.db, "User");
        // const userDocRef = doc(userColRef, this.user.uid);
        
        const walletColRef = collection(userDocRef, "Wallets");
        console.log("USER id: " + this.user.uid);
        console.log(("Document id: " + userDocRef.id));
        
        await updateDoc(userDocRef , {
          gameDay: this.day,
          gameMonth: this.month,
          gameYear: this.year,
          gameHour: this.hour,
          gameMinute: this.minute,
          gameSecond: this.second,
          accountBalance: this.accountBalance
        }).catch((e)=>{
          console.log("Failed to save time data");
          
          this.toast.error({detail:"Failed to save time data", summary: e});
        });

        //Save coin data
            
            
            

          
          //Write coin data to database
          for(let i = 0; i < CoinService.coinName.length; i++){
            await updateDoc(doc(userDocRef, "Coins", CoinService.coinName[i]),{
              last24HoursValue: this.coins[i].last24HoursValue,
              valueLast365Days: this.coins[i].valueLast365Days,
              valueAYear: this.coins[i].valueAYear
            }).catch((e)=>{
              this.toast.error({detail:"Failed to save coins data", summary: e});
              console.log("Failed to save coins data");
            });;
          }

          //Write wallet data to database
          for(let i = 0; i < this.ownedWallets.length; i++){
            await updateDoc(doc(userDocRef, "Wallets", this.ownedWallets[i].walletName),{
              currentCapacity: this.ownedWallets[i].currentCapacity,
              isPurchased: this.ownedWallets[i].isPurchased
            }).catch((e)=>{
              this.toast.error({detail:"Failed to save wallet data", summary: e});
              console.log("Failed to save wallet data");
              
            });;

            const walletDocRef = doc(walletColRef, this.ownedWallets[i].walletName);
            //Loop all coins contain of each wallet
            for(let coinInWalletIndex = 0 ; coinInWalletIndex < this.ownedWallets[i].coinsContent.length; coinInWalletIndex++){
              await updateDoc(doc(walletDocRef, "CoinsContain", this.ownedWallets[i].coinsContent[coinInWalletIndex].coinName),{
                currentPrice: this.ownedWallets[i].coinsContent[coinInWalletIndex].currentPrice,
                totalInvestment: this.ownedWallets[i].coinsContent[coinInWalletIndex].totalInvestment
              }).catch((e)=>{
                this.toast.error({detail:"Failed to save all coin contain data", summary: e});
                console.log("Failed to save all coin contain data");
                
              });
            }
          }

          //Update score to top score table by calculate all the amount of money then update the db
            let totalScore = 0;
            let walletsScore = 0;

            //Sum all money from all 4 wallets
            for(let walletIndex = 0; walletIndex < this.ownedWallets.length; walletIndex++){
              walletsScore += this.ownedWallets[walletIndex].balance; 
              if(this.ownedWallets[walletIndex].coinsContent != null){
                //Sum all money from all the coins inside wallets
                for(let coinIndex = 0; coinIndex < this.ownedWallets[walletIndex].coinsContent.length; coinIndex++){
                  walletsScore += this.ownedWallets[walletIndex].coinsContent[coinIndex].amount * this.ownedWallets[walletIndex].coinsContent[coinIndex].currentPrice;
                  
                }
              }
            }

            //Update score to db
            try{
              await updateDoc(doc(this.db,"UsersScore", this.user.uid ),{
                score: totalScore + walletsScore + this.accountBalance,
                gameMode : this.gameMode,
                name: this.userFirstName + " " + this.userLastName
              }).then(()=>{
                this.isLoading = false;
              });
            }catch(e){
              console.log("Failed to update user score: " + e);
              
            }
            
            
            
            

        this.toast.success({detail:"Saved Game", duration: 2000})  
        

          

        
      }else{
        console.log("Can not get current user");
        
      }
    }catch(e){
      console.error("Error adding User data: ", e);
    }
  }



      /******************
    * Day/week/month chart button controller
    *******************/
        onDayChartClicked(){
          
          if(!this.isTripleButtonClicked){
            

            this.chosenChart = HomeGameComponent.DAY_CHART;
          
            //Update the price display of a coin in the coin list
            for(let i = 0; i < this.coins.length; i++){
              this.coins[i].price = this.coins[i].last24HoursValue[23];
            }

            this.update24HourChartAndValueOfTheChart();
            this.coinGraph?.chart?.update();
          }else{
            this.dialogRef.open(ErrorMessageModalComponent,{
              data: {
                errorCode: "Can Not Perform This Action!",
                errorMessage: "You can not choose the day chart when running fastest mode",
                errorSolution: "Please pick another speed mode before choosing day chart!"
              }
            });
          }
          
        }

        onWeekChartClicked(){
          this.chosenChart = HomeGameComponent.WEEK_CHART;

          //Update the price display of a coinon the left table 
          for(let i = 0; i < this.coins.length; i++){
            this.coins[i].price = this.coins[i].valueLast365Days[this.DAY_OF_A_YEAR - 1];
          }
          this.update7DayAnd30DayChartAndValueOfTheChart();
          this.coinGraph?.chart?.update();
        }


        onMonthChartClicked(){
          this.chosenChart = HomeGameComponent.MONTH_CHART;
          //Update the price display of a coinon the left table 
          for(let i = 0; i < this.coins.length; i++){
            this.coins[i].price = this.coins[i].valueLast365Days[this.DAY_OF_A_YEAR - 1];
          }
          this.update7DayAnd30DayChartAndValueOfTheChart();
          this.coinGraph?.chart?.update();
          
        }

        onYearChartClicked(){
          
          
          this.chosenChart = HomeGameComponent.YEAR_CHART;
          //Update the price display of a coinon the left table 
          for(let i = 0; i < this.coins.length; i++){
            this.coins[i].price = this.coins[i].valueLast365Days[this.DAY_OF_A_YEAR - 1];
          }
          this.updateYearChart();
          this.coinGraph?.chart?.update();
        }






    /******************
    * END Day/week/month/year chart button controller
    *******************/

    
   
    //Update exchange wallet balance and transaction data through inner child ( from review component)
    @HostListener('updateExchangeBalance', ['$event'])
    onCustomEventCapturedFromReviewComponent(event: any) {
    this.ownedWallets[0].balance = event.detail.data;
    //Update transaction data
    this.transactions.push(event.detail.transaction);
    
    //Update exchangeWalletInvestmentCurrentlyTotal 
    if(event.detail.transaction.transactionType == 'buy'){
      this.exchangeWalletInvestmentCurrentlyTotal +=  event.detail.transaction.orderTotal;
    }else{
      this.exchangeWalletInvestmentCurrentlyTotal -=  event.detail.transaction.orderTotal;
    }
    

    
    

    //Update balance array object
    this.balanceDisplayObjectArray[1].balance = event.detail.data;
    this.balanceDisplayObjectArray[2].balance = this.balanceDisplayObjectArray[1].balance + this.balanceDisplayObjectArray[0].balance;
  }


  //Update current balance and wallet through inner child ( from addfund component)
  @HostListener('updateFromAddFundComponent', ['$event'])
  onCustomEventCapturedFromAddFund(event: any) {
  this.accountBalance = event.detail.accountBalance;
  this.ownedWallets = event.detail.ownedWallets;
  this.balanceDisplayObjectArray[0].balance = this.accountBalance;
  this.balanceDisplayObjectArray[1].balance = this.ownedWallets[0].balance;
  this.balanceDisplayObjectArray[2].balance = this.balanceDisplayObjectArray[0].balance + this.balanceDisplayObjectArray[1].balance;
  } 

   //Update selected coin through inner child ( from exchange component to Home-game component )
   @HostListener('updateSelectedCoin', ['$event'])
   customEventToSendDataToTopParentFromExchangeCom(event: any) {
   this.selectedCoin = event.detail.data;
   this.coinGraph?.onTradeButtonTogge(); // toggle trade button
   }


  
}


