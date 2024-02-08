import { CurrencyPipe } from "@angular/common";
import { Coins } from "./coins.model";
import { OwnedCoin} from "./ownedCoin.model"

export class OwnedWallet{
    walletName: string;
    currentCapacity: number;
    coinsContent: OwnedCoin[];
    isPurchased: boolean;
    balance: number;
    addressId: string;
    maxCap: number;
    

    constructor(walletName: string, currentCapacity: number, coinsContent: OwnedCoin[], isPurchased: boolean, balance: number, addressId: string,  maxCap: number){
        this.walletName = walletName;
        this.coinsContent = coinsContent;
        this.currentCapacity = currentCapacity;
        this.isPurchased = isPurchased;
        this.balance = balance;
        this.addressId = addressId;
        this.maxCap = maxCap;
    }

}