export class Coins{
    name: string;
    price: number;  
    last24HoursValue: number[];
    valueLast365Days: number[];
    valueAYear: number[]; //each element, which is an average of all the days of the month


    constructor(name: string, price: number){
        this.name = name;
        this.price = price;
        this.last24HoursValue = [];
        this.valueLast365Days = [];
        this.valueAYear = [];
    }
}