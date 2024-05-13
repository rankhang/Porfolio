import { AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { AbstractControl, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { OwnedCoin } from 'src/app/models/ownedCoin.model';
import { Coins } from 'src/app/models/coins.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageModalComponent } from 'src/app/error-message-modal/error-message-modal.component';
import { collection, deleteDoc, doc, Firestore, setDoc, updateDoc } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { NgToastService } from 'ng-angular-popup';




@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  isLoading = false;

  math = Math;
  @Input() ownedWallets: OwnedWallet[] = [];
  walletControl = new FormControl('');
  chosenWallet: OwnedWallet  = this.ownedWallets[0]== null?new OwnedWallet('',-1,[],false,0, "", 0):this.ownedWallets[0];
  quantity!: any;
  walletAddressInput!: any;
  @Input() coins!: Coins[]; // This contains all the information of the coin such 365 days, 24 hours prices of all the coin
  isCoinInWalletButtonDisabled = true;
  isTransferButtonClicked = false;

  //These variables are used when a button in a wallet clicked
  isCoinButtonInAWalletClicked = false;
  selectedOwnedCoinInTheWallet!: OwnedCoin; // this model only have 2 properties (name and amount)
  selectedCoinInTheWallet!: Coins; // this cointains prices of the selected coin 
  isExchangeWalletAcordionClicked = false;

  @Input() db! :Firestore;
  @Input() auth!:Auth 
  @Input() user!:User|null 

  

  

  ngOnInit(): void {
    
  }

  constructor(private dialogRef: MatDialog, private toast: NgToastService){
    
  }

  onWalletClicked(walletIndex: number){
    this.chosenWallet = this.ownedWallets[walletIndex];
    this.isCoinButtonInAWalletClicked = false;
  }


  onCoinInWalletClicked( coinIndex: number){
    this.isExchangeWalletAcordionClicked = true; // control to open transfer acordion
    this.quantity = null;
    this.isCoinButtonInAWalletClicked = true;
    this.selectedOwnedCoinInTheWallet = this.chosenWallet.coinsContent[coinIndex];
  }

  onTransferButtonClicked(){
    this.isCoinInWalletButtonDisabled = !this.isCoinInWalletButtonDisabled;
    this.isTransferButtonClicked = !this.isTransferButtonClicked;
  }

  onCloseClicked(){
    this.quantity = null;
    this.isCoinInWalletButtonDisabled = true;
    this.isTransferButtonClicked = false;
    this.walletAddressInput = null;
    this.isExchangeWalletAcordionClicked = false;
    this.isCoinButtonInAWalletClicked = false;
  }


  //Updata database when after completed the transfer
  async updateWalletDataInDB(walletName: string, wallet: OwnedWallet, needUpdateCoin: OwnedCoin, task: string){
    const userColRef = collection(this.db, "User");
    const userDocRef = doc(userColRef, this.user!.uid);
    const walletColRef = collection(userDocRef, "Wallets");
    const walletDocRef = doc(walletColRef, walletName);
    const coinContainColRef = collection(walletDocRef, "CoinsContain");
    const coinContainDocRef = doc(coinContainColRef, needUpdateCoin.coinName);
    try{
      try{
        await updateDoc(walletDocRef, {
          currentCapacity: wallet.currentCapacity //update capacity
        });
      }catch(e){
        console.log("Failed to update capacity");
        
      }
  
  
      if(task == "update"){ 
        try{
          await updateDoc(coinContainDocRef, {
            amount: needUpdateCoin.amount,
            totalInvestment: needUpdateCoin.totalInvestment,
            currentPrice: needUpdateCoin.currentPrice,
            coinName: needUpdateCoin.coinName
          });
        }catch(e){
          console.log("Failed to transfer coin " + e);
        }
      }else if(task == 'remove'){ //Remove
        try{
          await deleteDoc(coinContainDocRef);
        }catch(e){
          console.log("Failed to remove coin " + e);
        }
      }else if(task == 'setNew'){ // Set new doc
        await setDoc(coinContainDocRef,{
          amount: needUpdateCoin.amount,
          totalInvestment: needUpdateCoin.totalInvestment,
          currentPrice: needUpdateCoin.currentPrice,
          coinName: needUpdateCoin.coinName
        })
      }
      this.isLoading = false;
      this.toast.success({detail:"Transfer Succeeded",duration:5000,summary:"The coin has been sent."})
    }catch(e){
      this.isLoading = false;
      this.toast.error({detail:"Send Failed", duration: 5000, summary:"Please try again."})
    }
    
  }


  

  onSendClicked(){
    this.isLoading = true;
    //Get more information about the coin
    for(let coinIndex = 0; coinIndex < this.coins.length; coinIndex++){
      if(this.selectedOwnedCoinInTheWallet.coinName == this.coins[coinIndex].name){
        this.selectedCoinInTheWallet = this.coins[coinIndex];
        break;
      }
    }
    
    
    //Find total investment for the transfered amount
    let totalInvesmenetInDestinationWallet = this.quantity * this.selectedOwnedCoinInTheWallet.totalInvestment / this.selectedOwnedCoinInTheWallet.amount;
    //Find wallet address to match with the address input
    for(let walletIndex = 0; walletIndex < this.ownedWallets.length; walletIndex++){
      //** UPDATE DESTINATION WALLET */
      if(this.ownedWallets[walletIndex].addressId 
        === this.walletAddressInput 
        && this.ownedWallets[walletIndex].isPurchased 
        && this.ownedWallets[walletIndex].maxCap != this.ownedWallets[walletIndex].coinsContent.length){ 
        //If Coin is not exist
        if(this.ownedWallets[walletIndex].coinsContent.length == 0){//If coin contain length = 0 
          
          this.ownedWallets[walletIndex].currentCapacity +=1; //Add capacity
          let aCoin = new OwnedCoin(this.selectedOwnedCoinInTheWallet.coinName, this.quantity,totalInvesmenetInDestinationWallet ,this.selectedCoinInTheWallet.last24HoursValue[23]);//new coin object
          this.ownedWallets[walletIndex].coinsContent.push(aCoin) // add the new coin to the destination wallet
          this.updateWalletDataInDB(this.ownedWallets[walletIndex].walletName,this.ownedWallets[walletIndex], aCoin, 'setNew')
        }else{
          let isCoinFound = false;
          // if the coin already exist in destination wallet
          for(let coinIndex = 0; coinIndex < this.ownedWallets[walletIndex].coinsContent.length; coinIndex++){
            //If coin found in the destination wallet, then add more coin to its quantity and update total investment
            if(this.ownedWallets[walletIndex].coinsContent[coinIndex].coinName == this.selectedOwnedCoinInTheWallet.coinName){
              //Add quantity
              this.ownedWallets[walletIndex].coinsContent[coinIndex].amount += this.quantity;
              //update totalInvestment
              this.ownedWallets[walletIndex].coinsContent[coinIndex].totalInvestment += totalInvesmenetInDestinationWallet;
              this.updateWalletDataInDB(this.ownedWallets[walletIndex].walletName,this.ownedWallets[walletIndex], this.ownedWallets[walletIndex].coinsContent[coinIndex], 'update');
              isCoinFound = true;
              break;
            } 
          }
          //If coin is not found in the wallet
          if(!isCoinFound){
            this.ownedWallets[walletIndex].currentCapacity +=1; //Add capacity
            let aCoin = new OwnedCoin(this.selectedOwnedCoinInTheWallet.coinName, this.quantity,totalInvesmenetInDestinationWallet ,this.selectedCoinInTheWallet.last24HoursValue[23]);//new coin object
            this.ownedWallets[walletIndex].coinsContent.push(aCoin) // add the new coin to the destination wallet
            this.updateWalletDataInDB(this.ownedWallets[walletIndex].walletName,this.ownedWallets[walletIndex], aCoin, 'setNew');
          }
        }
        
      }

      // ***** UPDATE SENT WALLET
      if(this.ownedWallets[walletIndex].walletName == this.chosenWallet.walletName){
        for(let coinIndex = 0 ; coinIndex < this.ownedWallets[walletIndex].coinsContent.length; coinIndex++){
          if(this.ownedWallets[walletIndex].coinsContent[coinIndex].coinName == this.selectedOwnedCoinInTheWallet.coinName){
            //Update quantity
            this.ownedWallets[walletIndex].coinsContent[coinIndex].amount -= this.quantity;
            //Update total investment
            this.ownedWallets[walletIndex].coinsContent[coinIndex].totalInvestment -= totalInvesmenetInDestinationWallet;
            this.updateWalletDataInDB(this.ownedWallets[walletIndex].walletName,this.ownedWallets[walletIndex], this.ownedWallets[walletIndex].coinsContent[coinIndex], 'update')
          }
          //Remove the wallet of the array if its quantity == 0
          if(this.ownedWallets[walletIndex].coinsContent[coinIndex].amount == 0){
            this.ownedWallets[walletIndex].currentCapacity -= 1;
            this.updateWalletDataInDB(this.ownedWallets[walletIndex].walletName,this.ownedWallets[walletIndex], this.ownedWallets[walletIndex].coinsContent[coinIndex], 'remove')
            this.ownedWallets[walletIndex].coinsContent.splice(coinIndex, 1); // remove coin
            
            
          }
        }
      }
    }

    
    
    
    
    // this.dialogRef.open(ErrorMessageModalComponent,{
    //   data: {
    //     errorCode: "Transfer Successfully",
    //     errorMessage: "The coin has been sent to wallet address: " + this.walletAddressInput,
    //     errorSolution: ""
    //   }
    // });

    this.onCloseClicked();
  }
  
 




}
