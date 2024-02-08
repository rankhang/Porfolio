export class TransactionModel {
    day: number;
    year: number;
    month: number;
    coinName: string;
    coinAmount: number;
    transactionType: string;
    price: number;
    transactionNumber: number;
    orderTotal: number;
    transactionColorControl: string;
    

     constructor (orderTotal: number,day: number, month: number, year: number,coinName: string, coinAmount: number, transactionType : string, price: number,transactionNumber: number, transactionColorControl: string) {
        this.orderTotal = orderTotal;
        this.day = day;
        this.month = month;
        this.year = year;
        this.coinName = coinName;
        this.coinAmount = coinAmount;
        this.transactionType = transactionType;
        this.price = price;
        this.transactionNumber = transactionNumber;
        this.transactionColorControl = transactionColorControl;
    }
    
}