import { Month } from "./models/month.model";
import * as moment from 'moment';
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


    static formatDateService(date: Date){
        let formattedDate = "";
        let current = new Date();
        
        if(date.getFullYear() != current.getFullYear()){
           formattedDate = moment(date).format('LL');
        }else if(moment(current).diff(date, 'days') < 7){
          formattedDate =  moment(date).from(current)
        }else if(date.getMonth() == current.getMonth()){
          formattedDate = moment(date).format('MMM DD') + " at " + moment(date).format('LT');
        }else if(date.getMonth() != current.getMonth()){
          formattedDate = moment(date).format('MMM DD');
        }
        return formattedDate;
        
    }
}