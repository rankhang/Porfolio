import { OwnedCoin } from "./ownedCoin.model";

export class Wallet{
    name: string;
    price: number;
    capacity: number;
    security: string;
    fragility: string;
    type: string;
    securityTextColor: string = "";
    fragilityTextColor: string = "";

  
   

    constructor(price: number, capacity: number, security: string, fragility: string, type: string, name: string){
        this.price = price;
        this.capacity = capacity;
        this.security = security;
        this.fragility = fragility;
        this.type = type;
        this.name = name;
    
    }
}