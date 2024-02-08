import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Auth, getAuth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Coins } from 'src/app/models/coins.model';
import { OwnedCoin } from 'src/app/models/ownedCoin.model';
import { OwnedWallet } from 'src/app/models/ownedWallet.model';
import { TransactionModel } from 'src/app/models/transaction.model';
import { Name } from 'src/app/name';

@Component({
  selector: 'app-exchange-wallet',
  templateUrl: './exchange-wallet.component.html',
  styleUrls: ['./exchange-wallet.component.css']
})
export class ExchangeWalletComponent implements OnInit {

  NEWEST_SORT = "NEWEST_SORT";
  OLDEST_SORT = "OLDEST_SORT";
  NAME_SORT = "NAME_SORT";
  BUY_SORT = "BUY_SORT";
  SELL_SORT = "SELL_SORT";
  NONE_SORT = "NONE";
  

  @Input() db! :Firestore;
  @Input() auth!:Auth 
  @Input() user!:User|null 


  @Input() ownedWallets!: OwnedWallet[];
  exchangeOptionTab = 'wallet';
  selected = 'wallet';
  @Input() coins!: Coins[];
  searchCoin:string = "";
  @Input() accountBalance! : number;
  math = Math;
  appExchangeName = Name.appExchangeName;
  
  aCoin: Coins = new Coins('',0);
  @Input() transactions!: TransactionModel[];
  @Input() transactionColorControl!: string[];

  transactionSort!: TransactionModel[];
  sortType = '';
  orderNumber!: number[];

  @Input() exchangeWalletInvestmentCurrentlyTotal: number = 0;
  @Input() exchangeWalletOriginalInvestment: number = 0;

  
  

  @ViewChild('searchbar') searchbar:ElementRef | undefined;
  // private readonly SHRINK_TOP_SCROLL_POSITION = 64;
  // shrinkToolbar = false;
  // scrollingSubscription: any;
  // scrollTop: any;
 
 
  toggleSearch:boolean = false;

  constructor(private elementRef: ElementRef) {
    
  }

  ngOnInit(): void {
    this.setOrderNumbers();
  }

  // onTradeClicked(){
  //   this.selected = 'wallet';
  //   this.exchangeOptionTab = 'wallet';
  // }


  // onAccountSummaryClicked(){
  //   for(let i = 0; i < this.ownedWallets[0].coinsContent.length; i++){
  //     this.accountInvestmentCurrentlyTotal += this.ownedWallets[0].coinsContent[i].currentPrice * this.ownedWallets[0].coinsContent[i].amount;
  //   }
  // }

  onTransactionClicked(){
    this.exchangeOptionTab = 'transaction';
  }

  onWalletClicked(){
    this.exchangeOptionTab = 'wallet';
  }

  onMarketClicked(){
    this.exchangeOptionTab = 'market';
  }

  onCoinInMarketClicked(aCoin: Coins){
      this.aCoin = aCoin;  
      this.customEventToSendDataToTopParentFromExchangeCom();   
  }

  onCoinInWalletClicked(ownedCoin: OwnedCoin){
    for(let coinIndex = 0 ; coinIndex < this.coins.length; coinIndex++){
      if(this.coins[coinIndex].name == ownedCoin.coinName){
        this.aCoin = this.coins[coinIndex];
        break;
      }
    }
    this.customEventToSendDataToTopParentFromExchangeCom();
  }

  onAddFundClicked(){

  }

  openSearch(){
    this.toggleSearch = true;
    this.searchbar?.nativeElement.focus();
  }
  searchClose(){
    this.searchCoin = '';
    this.toggleSearch = false;
  }


  customEventToSendDataToTopParentFromExchangeCom(){
    //send data to home-game component
    const event: CustomEvent = new CustomEvent('updateSelectedCoin', {
      bubbles: true,
      detail: { data: this.aCoin }
    });
    this.elementRef.nativeElement.dispatchEvent(event);
  }


  onSortNewestClicked(){
    this.sortType = this.NEWEST_SORT;
    this.sort(this.sortType);
  }
  onSortOldestClicked(){
    this.sortType = this.OLDEST_SORT;
    this.sort(this.sortType);
  }
  onSortNameClicked(){
    this.sortType = this.NAME_SORT;
    this.sort(this.sortType);
  }
  onSortSellClicked(){
    this.sortType = this.SELL_SORT;
    this.sort(this.sortType);
  }
  onSortBuyClicked(){
    this.sortType = this.BUY_SORT;
    this.sort(this.sortType);
  }
  onSortNoneClicked(){
    this.sortType = this.NONE_SORT;
    this.sort(this.sortType);
    // this.sortType = '';
  }


  onCloseButtonClicked(){
    this.sortType = '';
    this.transactionSort = []; //remove all elements
    this.transactionSort = Object.assign([],this.transactions); //clone array
  }

  sellAndBuySort(sortType: string){
    let t = '';
    if(sortType == this.BUY_SORT){
      t = 'buy';
    }else if(sortType == this.SELL_SORT){
      t = 'sell';
    }
    this.transactionSort = []; //remove all elements
    for(let tranIndex = 0; tranIndex < this.transactions.length; tranIndex++){
      if(this.transactions[tranIndex].transactionType == t){
        this.transactionSort.push(this.transactions[tranIndex]);
      }
    }
  }

  sort(type: string){
    if(type==this.NEWEST_SORT){
      // // const myClonedArray  = Object.assign([], myArray);
      this.transactionSort = []; //remove all elements
      this.transactionSort = Object.assign([],this.transactions); //clone array
      this.quickSort(this.transactionSort, 0, this.transactionSort.length - 1);
      this.transactionSort.reverse();
    }
    else if(type==this.OLDEST_SORT){
      this.transactionSort = []; //remove all elements
      this.transactionSort = Object.assign([],this.transactions); //clone array
      this.quickSort(this.transactionSort, 0, this.transactionSort.length - 1);

      
    }
    else if(type==this.BUY_SORT){
      this.sellAndBuySort(type);
    }
    else if(type==this.SELL_SORT){
      this.sellAndBuySort(type);
    }
    else if(type==this.NAME_SORT){
      this.transactionSort = []; //remove all elements
      this.transactionSort = Object.assign([],this.transactions);
      this.transactionSort.sort((a, b) => a.coinName.localeCompare(b.coinName));
    }else{ // NONE Sort
      this.transactionSort = []; //remove all elements
      this.transactionSort = Object.assign([],this.transactions);
    }
  }


  //Set all order number of transaction to an array
  setOrderNumbers(){
    for(let index = 0 ; index < this.transactions.length; index++){
      this.orderNumber[index] = this.transactions[index].transactionNumber;
    }
  }

  //QUICK SORT
  // A utility function to swap two elements
  swap(transactions: TransactionModel[], i: number, j: number) {
	// let temp = transactions[i].transactionNumber;
  let temp = transactions[i];
	// transactions[i].transactionNumber = transactions[j].transactionNumber;
	// transactions[j].transactionNumber = temp;
  transactions[i] = transactions[j];
  transactions[j] = temp;
}

/* This function takes last element as pivot, places
the pivot element at its correct position in sorted
array, and places all smaller (smaller than pivot)
to left of pivot and all greater elements to right
of pivot */
  partition(transactions: TransactionModel[], low: number, high: number) {

	// pivot
	let pivot = transactions[high].transactionNumber;

	// Index of smaller element and
	// indicates the right position
	// of pivot found so far
	let i = (low - 1);

	for (let j = low; j <= high - 1; j++) {

		// If current element is smaller
		// than the pivot
		if (transactions[j].transactionNumber < pivot) {

			// Increment index of
			// smaller element
			i++;
			this.swap(transactions, i, j);
		}
	}
	this.swap(transactions, i + 1, high);
	return (i + 1);
}

/* The main function that implements QuickSort
		arr[] --> Array to be sorted,
		low --> Starting index,
		high --> Ending index
*/
 quickSort(transactions: TransactionModel[], low: number, high: number) {
	if (low < high) {

		// pi is partitioning index, arr[p]
		// is now at right place
		let pi = this.partition(transactions, low, high);

		// Separately sort elements before
		// partition and after partition
		this.quickSort(transactions, low, pi - 1);
		this.quickSort(transactions, pi + 1, high);
	}
}



 

}
