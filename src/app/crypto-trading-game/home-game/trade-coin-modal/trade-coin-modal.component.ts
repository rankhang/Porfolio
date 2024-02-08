import { AfterContentChecked, AfterViewChecked, Component, DoCheck, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Coins } from 'src/app/models/coins.model';
import { OwnedCoin } from 'src/app/models/ownedCoin.model';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TransactionModel } from 'src/app/models/transaction.model';
import { Firestore } from 'firebase/firestore';
import { Auth, getAuth, User } from 'firebase/auth';

@Component({
  selector: 'app-trade-coin-modal',
  templateUrl: './trade-coin-modal.component.html',
  styleUrls: ['./trade-coin-modal.component.css']
})
export class BuyCoinModalComponent implements OnInit{

  @Input() selectedCoin!: Coins;
  @Input() ownedWallet: OwnedWallet[] = [];
  @Input() accountBalance: number = 0;
  @Input() month!: number;
  @Input() year!: number;
  @Input() day!: number;
  
 
  math = Math;
  searchCoin:string = "";
  isShowAllClicked: boolean = false;

  @Output() accountBalanceChange = new EventEmitter<number>();


  //These variables are used when a button in a wallet clicked
  isCoinButtonInAWalletClicked = false;
  selectedOwnedCoinInTheWallet!: OwnedCoin; // this model only have 2 properties (name and amount)
  selectedCoinInTheWallet!: Coins; // this cointains prices of the selected coin 
  
  @Input() coins!: Coins[]; // This contains all the information of the coin such 365 days, 24 hours prices of all the coin
  
  @Input() db!: Firestore 
  @Input() auth!:Auth 
  @Input() user!:User|null 

  @Input() tradeOption: string= "";
  selected: any = ""
  chosenWallet: OwnedWallet  = new OwnedWallet("", 0,[], false, 0,"",0);
  quantity!: any;
  moneyAmountToBuyCoinFraction!: any;
  
  walletControl = new FormControl('');
  coinControl = new FormControl('');
  usAmount!: string;


  constructor() {
    
  }
  

  // TEST

  @ViewChild('searchbar') searchbar:ElementRef | undefined;
  // private readonly SHRINK_TOP_SCROLL_POSITION = 64;
  // shrinkToolbar = false;
  // scrollingSubscription: any;
  // scrollTop: any;
 
 
  toggleSearch:boolean = false;
  

  

 openSearch(){
   this.toggleSearch = true;
  //  this.tradeOption = "";
   this.searchbar?.nativeElement.focus();
 }
 searchClose(){
   this.isShowAllClicked = false;//close show all
   this.searchCoin = '';
   this.toggleSearch = false;
   this.matButtonToggleGroupReset();
 }


  //END TEST
  updateUSAmount(event: any) { 
    this.usAmount = event.target.value;
    this.moneyAmountToBuyCoinFraction = parseFloat(this.moneyAmountToBuyCoinFraction);
   }
  

  
  quantityInputClicked(){
    this.moneyAmountToBuyCoinFraction =  null;
  }

  coinAmountInputClicked(){
    this.quantity = null;
  }

  onAllButtonClicked(){
   
    
    this.quantity = this.selectedOwnedCoinInTheWallet.amount;
    console.log(this.quantity);
  }

  onReviewOrderClicked(){
    
    this.isCoinButtonInAWalletClicked = false;
    
  }
 

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.matButtonToggleGroupReset();
  // }

  ngOnInit(): void {
   
  }

  onSearchCoinButtonClicked(coin: Coins){
    this.selectedCoin = coin;
    this.searchClose();
  }

  onWalletClicked(walletIndex: number){
    this.chosenWallet = this.ownedWallet[walletIndex];
  }

  onBuyClicked(){
    this.quantity = null;
    this.tradeOption = "buy";
  }
  onSellClicked(){
    this.quantity = null;
    this.tradeOption = "sell";
  }

  onShowAllButtonClicked(){
    this.isShowAllClicked = !this.isShowAllClicked;
  }

  matButtonToggleGroupReset(){
    
    
    this.tradeOption = "";
    this.selected = undefined;
    this.walletControl.reset();
    this.coinControl.reset();
    this.quantity = null;
    this.moneyAmountToBuyCoinFraction = null;
    
    //reset the name to the coin name in the main page ( Home game)
    // this.selectedCoinInTheWallet = this.selectedCoin;
    
    
  }


  onCoinInWalletClicked( coinIndex: number){
    this.quantity = null;
    this.isCoinButtonInAWalletClicked = true;
    this.selectedOwnedCoinInTheWallet = this.chosenWallet.coinsContent[coinIndex];
    //Find all information of the ownedCoin
    for(let i = 0 ; i < this.coins.length; i++){
      if(this.coins[i].name == this.selectedOwnedCoinInTheWallet.coinName){
        this.selectedCoinInTheWallet = this.coins[i];
        break;
      }
    }
  }


  onAddFundClicked(){

  }




  


 

  

}
