export class User{
    email: string;
    fname: string;
    lname: string;
    joinedDate: Date;
    

    constructor(email: string, fname : string, lname: string, joinedDate: Date){
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.joinedDate = joinedDate;
    }
}