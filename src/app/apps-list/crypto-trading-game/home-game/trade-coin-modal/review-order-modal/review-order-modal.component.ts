import { AfterContentChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, getAuth, User } from 'firebase/auth';
import { arrayUnion, collection, deleteDoc, doc, Firestore, getDoc, getFirestore, setDoc, Transaction, updateDoc } from 'firebase/firestore';
import { trace } from 'firebase/performance';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { Coins } from 'src/app/models/coins.model';
import { OwnedCoin } from 'src/app/models/ownedCoin.model';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { Name } from 'src/app/name';
import { SaveGameService } from 'src/app/save-game.service';
import { TransactionModel } from 'src/app/models/transaction.model';
import { set, update } from 'firebase/database';
import * as firebase from 'firebase/compat';
import { BuyCoinModalComponent } from '../trade-coin-modal.component';
import { SharedService } from 'src/app/shared.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-review-order-modal',
  templateUrl: './review-order-modal.component.html',
  styleUrls: ['./review-order-modal.component.css']
})
export class ReviewOrderModalComponent implements OnInit, OnChanges {
  @Input() quantity!: null | number;
  @Input() selectedCoin!: Coins;
  @Input() ownedWallet: OwnedWallet[] = [];
  @Input() tradeOption!: string;
  @Input() accountBalance: number = 0;
  @Input() moneyAmountToBuyCoinFraction!: null;
  @Input() selectedCoinInTheWallet!: Coins;
  @Input() chosenWallet!: OwnedWallet;

  @Input() day!: number;
  @Input() month!: number;
  @Input() year!: number;

  totalTransaction!: number;

  @ViewChild(BuyCoinModalComponent) tradeComponentViewChild: BuyCoinModalComponent | undefined;

  // fractionQuantity! : number;
  @Input() db!: Firestore
  @Input() auth!: Auth
  @Input() user!: User | null

  isLoading = false;



  constructor(private elementRef: ElementRef, private tradeCom: BuyCoinModalComponent, private sharedService: SharedService, private toast: NgToastService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("moneyAmountToBuyCoinFraction " + this.moneyAmountToBuyCoinFraction);

  }



  ngOnInit(): void {

  }

  addNewCoinToOwnedWallet(walletIndex: number, containCoinIndex: number, isCapacityNeedToBeUpdated: boolean) {
    let coin = new OwnedCoin(this.selectedCoin.name, this.quantity!, this.quantity! * this.selectedCoin.last24HoursValue[23], this.selectedCoin.last24HoursValue[23]);
    this.ownedWallet[walletIndex].coinsContent.push(coin);
    this.saveOrderToDatabase(walletIndex, containCoinIndex, isCapacityNeedToBeUpdated, Name.ExchangeWallet);
  }

  async saveOrderToDatabase(walletIndex: number, containCoinIndex: number, isCapacityNeedToBeUpdated: boolean, walletName: string) {

    //save order to Wallets collection in database
    const userColRef = collection(this.db, "User");
    const userDocRef = doc(userColRef, this.user!.uid);


    const walletColRef = collection(userDocRef, "Wallets");
    const walletDocRef = doc(walletColRef, walletName);
    const coinContentColRef = collection(walletDocRef, "CoinsContain")

    try {
      //Update coin content collection in exchange wallet doc
      if (containCoinIndex == -1) {
        for (let i = 0; i < this.ownedWallet[walletIndex].coinsContent.length; i++) {
          if (this.ownedWallet[walletIndex].coinsContent[i].coinName == this.selectedCoin.name) {
            containCoinIndex = i;
            break;
          }
        }
      }


      //Remove the coin from the wallet if its quantity = 0
      if (this.ownedWallet[walletIndex].coinsContent[containCoinIndex].amount == 0) {
        //remove its doc in db base
        try {
          await deleteDoc(doc(coinContentColRef, this.ownedWallet[walletIndex].coinsContent[containCoinIndex].coinName));
        } catch (e) {
          console.log("Failed to delete doc");
        }

        //remove it from current array
        this.ownedWallet[walletIndex].coinsContent.splice(containCoinIndex, 1);

        //Update capacity
        this.ownedWallet[walletIndex].currentCapacity -= 1;


        //Update capacity in database
        try {
          await updateDoc(doc(userDocRef, "Wallets", Name.ExchangeWallet), {
            currentCapacity: this.ownedWallet[walletIndex].currentCapacity
          });
        } catch (e) {
          console.log("Failed to update capacity");
        }

      } else {
        try {
          await setDoc(doc(coinContentColRef, this.ownedWallet[walletIndex].coinsContent[containCoinIndex].coinName), {
            coinName: this.ownedWallet[walletIndex].coinsContent[containCoinIndex].coinName,
            amount: this.ownedWallet[walletIndex].coinsContent[containCoinIndex].amount,
            totalInvestment: this.ownedWallet[walletIndex].coinsContent[containCoinIndex].totalInvestment,
            currentPrice: this.selectedCoin.last24HoursValue[23]
          }, { merge: true });
        } catch (e) {
          console.log("Failed to update coin contain");

        }



        if (isCapacityNeedToBeUpdated) {
          //Update capacity
          this.ownedWallet[walletIndex].currentCapacity += 1;
          //Update capacity in database
          try {
            await updateDoc(doc(userDocRef, "Wallets", Name.ExchangeWallet), {
              currentCapacity: this.ownedWallet[walletIndex].currentCapacity
            });
          } catch (e) {
            console.log("Failed to update capacity when capacity need to be updated");

          }

        }
      }

      //Update wallet balance in database
      try {
        await updateDoc(doc(userDocRef, "Wallets", Name.ExchangeWallet), {
          balance: this.ownedWallet[walletIndex].balance
        });
      } catch (e) {
        console.log("Failed to update wallet balance");
      }

      //Save currentBalance to database

      SaveGameService.saveAccountBalance(this.db, this.auth, this.accountBalance);
      this.isLoading = false;
      this.toast.success({ detail: "Trade Succeeded", summary: "The transaction is completed.", duration: 5000 })
    } catch (e) {
      this.toast.error({ detail: "Trade Failed", summary: "Unknown error, please try again.", duration: 5000 })
    }

  }

  clearAllData() {
    this.quantity = null;
    this.tradeOption = "";
    // this.selectedCoin = new Coins("",0)
    this.moneyAmountToBuyCoinFraction = null;
    this.tradeCom.matButtonToggleGroupReset(); //clear the modal data
  }


  async customEventToSendDataToTopParent() {


    //send data to home-game component
    const event: CustomEvent = new CustomEvent('updateExchangeBalance', {
      bubbles: true,
      detail: {
        data: this.ownedWallet[0].balance,
        transaction: new TransactionModel(this.tradeOption != "sell"
          ? (this.quantity != null
            ? (this.quantity! * this.selectedCoin.last24HoursValue[23])
            : (this.moneyAmountToBuyCoinFraction!))
          : (this.quantity! * (this.selectedCoinInTheWallet == null ? 0 : this.selectedCoinInTheWallet.last24HoursValue[23])),
          this.day,
          this.month,
          this.year,
          this.tradeOption == 'buy'
            ? this.selectedCoin.name
            : this.selectedCoinInTheWallet.name,
          this.quantity != null
            ? this.quantity
            : (this.moneyAmountToBuyCoinFraction! / this.selectedCoin.last24HoursValue[23]),
          this.tradeOption,
          this.tradeOption == 'buy'
            ? this.selectedCoin.last24HoursValue[23]
            : this.selectedCoinInTheWallet.last24HoursValue[23],
          this.totalTransaction,
          this.tradeOption == 'buy' ? 'green' : 'red'
        )


      }

    });
    this.elementRef.nativeElement.dispatchEvent(event);
  }


  async saveTransactionToDB() {

    //check total transaction in db real time


    const transactionDocRef = doc(this.db, "Transaction", "totalTransactions");
    try {
      const transactionSnap = await getDoc(transactionDocRef);
      this.totalTransaction = transactionSnap.data()!['total'] + 1;
    } catch (e) {
      console.log("Failed to load total transaction in db:" + e);

    }


    console.log("From save transaction db: " + this.totalTransaction);


    const userColRef = collection(this.db, "User");
    const userDocRef = doc(userColRef, this.user!.uid);

    const transactionColRef = collection(userDocRef, "Transactions");

    //Write transaction data to db
    try {
      await setDoc(doc(transactionColRef, this.month + ":" + this.day + ":" + this.year + "-" + this.totalTransaction), {
        day: this.day,
        month: this.month,
        year: this.year,
        orderTotal: this.tradeOption != "sell"
          ? (this.quantity != null
            ? (this.quantity! * this.selectedCoin.last24HoursValue[23])
            : (this.moneyAmountToBuyCoinFraction!))
          : (this.quantity! * (this.selectedCoinInTheWallet == null ? 0 : this.selectedCoinInTheWallet.last24HoursValue[23])),
        transactionNumber: this.totalTransaction,
        coinName: this.tradeOption == 'buy'
          ? this.selectedCoin.name
          : this.selectedCoinInTheWallet.name,
        transactionAmount: this.quantity != null
          ? this.quantity
          : (this.moneyAmountToBuyCoinFraction! / this.selectedCoin.last24HoursValue[23]),
        transactionType: this.tradeOption,
        coinPrice: this.tradeOption == 'buy'
          ? this.selectedCoin.last24HoursValue[23]
          : this.selectedCoinInTheWallet.last24HoursValue[23],
        transactionColorControl: this.tradeOption == 'buy' ? 'green' : 'red'
      }).then(async () => {
        //Update total transaction in db
        await updateDoc(doc(this.db, "Transaction", "totalTransactions"), {
          total: this.totalTransaction
        })
      });
    } catch (e) {
      console.log("Failed to write transaction to db: " + e);
    }


  }


  async onPlaceOrderClicked() {
    this.isLoading = true;

    await this.saveTransactionToDB();

    if (this.tradeOption == "buy") {//BUY
      //Update account balance 
      if (this.quantity != null) { //buy by coin quantity
        this.ownedWallet[0].balance = this.ownedWallet[0].balance - (this.selectedCoin.last24HoursValue[23] * this.quantity!);
      } else { // buy by an amount of money
        this.ownedWallet[0].balance = this.ownedWallet[0].balance - this.moneyAmountToBuyCoinFraction!;
        this.quantity = this.moneyAmountToBuyCoinFraction! / this.selectedCoin.last24HoursValue[23];
        this.quantity = parseFloat(this.quantity.toFixed(8));
      }





      this.customEventToSendDataToTopParent();


      for (let walletIndex = 0; walletIndex < this.ownedWallet.length; walletIndex++) {
        //When you buy from the web exchange, the coin must be send to exchange wallet
        if (this.ownedWallet[walletIndex].walletName == Name.ExchangeWallet) {
          // if the wallet doesnt hold any coin 
          if (this.ownedWallet[walletIndex].coinsContent.length == 0) {
            this.addNewCoinToOwnedWallet(walletIndex, 0, true);

            //Call getExchangeWalletTotalAndOriginalInvestment() method in home-game component
            this.sharedService.sendClickEvent();
            this.clearAllData();

            return;
          } else {
            //Loop over all the coin in the wallet, if the coin exist, add more quantity to its amount
            for (let containCoinIndex = 0; containCoinIndex < this.ownedWallet[walletIndex].coinsContent.length; containCoinIndex++) {
              if (this.selectedCoin.name == this.ownedWallet[walletIndex].coinsContent[containCoinIndex].coinName) {
                this.ownedWallet[walletIndex].coinsContent[containCoinIndex].amount = this.ownedWallet[walletIndex].coinsContent[containCoinIndex].amount + this.quantity!;
                this.ownedWallet[walletIndex].coinsContent[containCoinIndex].totalInvestment += this.quantity * this.selectedCoin.last24HoursValue[23];
                this.saveOrderToDatabase(walletIndex, containCoinIndex, false, Name.ExchangeWallet);
                // this.quantity = null;
                //Call method in home-game component
                this.sharedService.sendClickEvent();

                this.clearAllData();
                return;
              }
            }
            //Coin not in the wallet yet, then add it
            this.addNewCoinToOwnedWallet(walletIndex, -1, true);

            //Call method in home-game component
            this.sharedService.sendClickEvent();

            this.clearAllData();
          }
        }
      }
    } else {//SELL
      //Update account balance 
      if (this.quantity != null) {
        this.ownedWallet[0].balance = this.ownedWallet[0].balance + (this.selectedCoinInTheWallet.last24HoursValue[23] * this.quantity!);
      }


      await this.customEventToSendDataToTopParent();

      for (let walletIndex = 0; walletIndex < this.ownedWallet.length; walletIndex++) {
        if (this.ownedWallet[walletIndex].walletName == this.chosenWallet.walletName) {
          //Loop over all the coin in the wallet, if the coin exist, subtract quantity to its amount
          for (let containCoinIndex = 0; containCoinIndex < this.ownedWallet[walletIndex].coinsContent.length; containCoinIndex++) {
            if (this.selectedCoinInTheWallet.name == this.ownedWallet[walletIndex].coinsContent[containCoinIndex].coinName) {
              this.ownedWallet[walletIndex].coinsContent[containCoinIndex].amount -= this.quantity!;


              this.saveOrderToDatabase(walletIndex, containCoinIndex, false, this.chosenWallet.walletName);
              //this.quantity = null;
              //Call method in home-game component
              this.sharedService.sendClickEvent();

              this.clearAllData();
              return;
            }
          }
        }
      }
    }






  }







}
