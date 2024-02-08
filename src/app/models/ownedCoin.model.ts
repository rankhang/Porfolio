export class OwnedCoin{
    coinName: string ;
    amount: number;
    totalInvestment: number;
    currentPrice: number; // the last hour price
    
    constructor(coinName: string, amount: number,totalInvestment: number, currentPrice: number){
        this.coinName = coinName;
        this.amount = amount;
        this.totalInvestment = totalInvestment;
        this.currentPrice = currentPrice;
    }

    toString() {
        return this.coinName + ', ' + this.amount;
    }
}