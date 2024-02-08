import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { IfStmt } from '@angular/compiler';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { databaseInstanceFactory } from '@angular/fire/database/database.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, getAuth, User } from 'firebase/auth';
import { collection, doc, Firestore, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';

import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { Name } from 'src/app/name';
import { WalletService } from 'src/app/wallet.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-fund-modal',
  templateUrl: './add-fund-modal.component.html',
  styleUrls: ['./add-fund-modal.component.css']
})
export class AddFundModalComponent implements OnInit {
  transferForm : FormGroup;
  isContinueButtonClicked = false;
  isFromAccountSelectClear = false;
  isToAccountSelectClear = false;
  isLoading = false;
  usAmount!: string;
  fromAccountString!: string;
  toAccountString!: string;
  
  isTOPersonalAccountDisabled = false;
  isTOExchangeWalletDisabled = false;

  isEnoughBalance = true;


  @Input() db! :Firestore;
  @Input() auth!:Auth 
  @Input() user!:User|null 

  @ViewChild('closeAccordionTwoButtonToggle', { static: true }) closeAccordionTwoButtonToggle!: ElementRef;
  @ViewChild('closeAccordionOneButtonToggle', { static: true }) closeAccordionOneButtonToggle!: ElementRef;
  @ViewChild('onCloseModalToggle', { static: true }) onCloseModalToggle!: ElementRef;
  
  

  constructor(public fb: FormBuilder, private elementRef: ElementRef, private toast: NgToastService) { 
    
    
    this.transferForm =fb.group({
      'toAccount' : ['', Validators.required],
      'fromAccount' : ['',Validators.required]
    })
    this.transferForm.reset();
  }
  
  @Input() accountBalance!: number;
  @Input() ownedWallets: OwnedWallet[] = [];
  bankTransferAmount: any ;
 
  onClosedClicked(){
    this.bankTransferAmount = null;
    this.usAmount =''; 
    this.isContinueButtonClicked = false;
    this.isFromAccountSelectClear = false;
    this.isToAccountSelectClear = false;
    this.transferForm.reset();
    this.closeAccordionTwoButtonToggle.nativeElement.click();
    this.closeAccordionOneButtonToggle.nativeElement.click();
  } 

  updateUSAmount(event: any) { 
    this.bankTransferAmount = 0;
    this.usAmount = event.target.value; 
    if(this.usAmount != ''){
      this.bankTransferAmount = parseFloat(this.usAmount);
    }

  }
  
  onFromAccountChange(){
    this.transferForm.get('toAccount')?.reset();
    this.isTOPersonalAccountDisabled = false;
    this.isTOExchangeWalletDisabled = false;
    this.isFromAccountSelectClear = false;
    if(this.transferForm.get('fromAccount')?.value == "Personal Account"){
      this.isTOPersonalAccountDisabled = true;
      this.fromAccountString = "Personal Account";
    }
    else if(this.transferForm.get('fromAccount')?.value == Name.appExchangeName){
      this.isTOExchangeWalletDisabled = true;
      this.fromAccountString =Name.appExchangeName;
    }
    this.isFromAccountSelectClear = true;
    
  }

  onToAccountChange(){
    if(this.transferForm.get('toAccount')?.value == Name.appExchangeName){
      this.isToAccountSelectClear = true;
      this.toAccountString = Name.appExchangeName;
    }else if(this.transferForm.get('toAccount')?.value == "Personal Account"){
      this.isToAccountSelectClear = true;
      this.toAccountString = "Personal Account";
    }
  }

  onContinueClicked(){
      this.isContinueButtonClicked = true;
  }

  ngOnInit(): void {
    
    
  }

  onTransferClicked(){
    this.isContinueButtonClicked = false;
    this.isFromAccountSelectClear = false;
    this.isToAccountSelectClear = false;
    this.isLoading = true;
    //Transfer from Personal account to KN Exchange
    if(this.fromAccountString == "Personal Account" && this.toAccountString == Name.appExchangeName){
      //Update the cash balance
      this.accountBalance -= this.bankTransferAmount;
      
      //Update the fund in the exchange
      for(let i = 0 ; i < this.ownedWallets.length; i++){
        if(this.ownedWallets[i].walletName == Name.ExchangeWallet){
          this.ownedWallets[i].balance += this.bankTransferAmount;
          this.saveDataTransferToDB(i);
        }
      }
    }
    //Transfer from exchange to personal account
    else if(this.fromAccountString == Name.appExchangeName && this.toAccountString== "Personal Account"){
      
      //Update the cash balance
      this.accountBalance += this.bankTransferAmount;
      
      //Update the fund in the exchange
      for(let i = 0 ; i < this.ownedWallets.length; i++){
        if(this.ownedWallets[i].walletName == Name.ExchangeWallet){
          this.ownedWallets[i].balance -= this.bankTransferAmount;
          this.saveDataTransferToDB(i);
        }
      }
    }
    
    this.customEventToSendDataToTopParent();
    
    
  }



  async saveDataTransferToDB(walletIndex: number){
    this.isLoading = true;
    
    const userColRef = collection(this.db, "User");
    const userDocRef = doc(userColRef, this.user!.uid);

    const docRef = await updateDoc(doc(this.db, "User", this.user!.uid),{
      accountBalance: this.accountBalance
    });

      // update exchange wallets to database
      await updateDoc(doc(userDocRef, "Wallets", Name.ExchangeWallet),{
        balance: this.ownedWallets[walletIndex].balance
      }).then(e=>{
        this.isLoading = false;
        this.toast.success({detail:"Transfer Succeeded", summary: "Transferred to " + this.toAccountString,duration:5000})
      });
  }


  customEventToSendDataToTopParent(){
    //send data to home-game component
  
    
    const event: CustomEvent = new CustomEvent('updateFromAddFundComponent', {
      bubbles: true,
      detail: { accountBalance: this.accountBalance, ownedWallets: this.ownedWallets }
    });
    this.elementRef.nativeElement.dispatchEvent(event);

    //Close
    this.onCloseModalToggle.nativeElement.click()
  }

  


}
