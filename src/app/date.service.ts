import { Month } from "./models/month.model";

export class DateStringGenerator{
    
    
    static dayString: string;
    static getDateString(day: number, 
                        month: number,
                        year: number,
                        hour: number,
                        minute: number,
                        second: number ){
        if(day == 1){
            this.dayString = day + "st";
          }else if(day == 2){
            this.dayString = day + "nd";
          }else if(day == 3){
            this.dayString = day + "rd";
          }else{
            this.dayString = day + "th";
          }
      
          return  Month.months[month-1] + " " + this.dayString + ", " + year + " " + 
                                 (hour < 10?"0":"") + hour + ":" +  
                                 (minute < 10?"0":"") + minute + ":" +
                                 (second < 10?"0":"") +  second;
    }
}