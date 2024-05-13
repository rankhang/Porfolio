import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { getAuth, User } from 'firebase/auth';
import { collection, doc, Firestore, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { ErrorMessageModalComponent } from 'src/app/error-message-modal/error-message-modal.component';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { OwnedCoin } from 'src/app/models/ownedCoin.model';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { Wallet } from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/wallet.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit{

  wallets: Wallet[] = [];
  @Input() ownedWallets: OwnedWallet[] = [];
  @Input() accountBalance!: number;

  @Output() accountBalanceChange = new EventEmitter<number>();
  
  
  @Input() db!: Firestore 
  @Input() auth!:Auth 
  @Input() user!:User|null 
  

  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(private dialogRef: MatDialog) {
    

    for(let walletIndex = 0; walletIndex < 4; walletIndex++){
      
      this.wallets.push(new Wallet(WalletService.price[walletIndex],
                                  WalletService.capacity[walletIndex], 
                                  WalletService.securityLevel[walletIndex],
                                  WalletService.fragilityLevel[walletIndex], 
                                  WalletService.type[walletIndex],
                                  WalletService.walletName[walletIndex]));   
      if(this.wallets[walletIndex].security == "High") this.wallets[walletIndex].securityTextColor = "green";
      else if(this.wallets[walletIndex].security == "Medium") this.wallets[walletIndex].securityTextColor = "grey";
      else this.wallets[walletIndex].securityTextColor = "#a8300f";


      if(this.wallets[walletIndex].fragility == "High") this.wallets[walletIndex].fragilityTextColor = "#a8300f";
      else if(this.wallets[walletIndex].fragility == "Medium") this.wallets[walletIndex].fragilityTextColor = "grey";
      else this.wallets[walletIndex].fragilityTextColor = "green";
                                            
    }
    
  }
 
  

  

  ngOnInit(): void {
  }

  async onBuyButtonClicked(walletIndex: number){
    
    const docRef = doc(this.db, "User", this.user!.uid);
    const walletColRef = collection(docRef, "Wallets");
    const walletDocRef = doc(walletColRef, this.wallets[walletIndex].name)

    // Set the "isPurchased" field of the wallet
    await updateDoc(walletDocRef, {
      isPurchased: true
    }).then(async ()=>{
      let dummyBalance = 0
      for(let index = 0; index < this.wallets.length; index++){
        if(this.wallets[walletIndex].name == this.ownedWallets[index].walletName){
          this.ownedWallets[index].isPurchased = true;
          dummyBalance = this.accountBalance - this.wallets[walletIndex].price
          this.accountBalanceChange.emit(dummyBalance);
        }
      }

      //Save account balance to database
      
      const userColRef = collection(this.db, "User");
      const userDocRef = doc(userColRef, this.user!.uid);
      await updateDoc(userDocRef,{
        accountBalance: dummyBalance
      });

      //
      //CLose the modal
      let el: HTMLElement = this.closeButton.nativeElement as HTMLElement;
      setTimeout(()=> el.click(), 1);
      
      this.dialogRef.open(ErrorMessageModalComponent,{
        data: {
          errorCode: "Thank you for your purchase!",
          errorMessage: `You have successfully purchased the ${this.wallets[walletIndex].name}.`,
          errorSolution: "Now you can transfer your coins to the wallet!"
        }
      });
    });

  }

}
