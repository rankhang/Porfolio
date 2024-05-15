import { Friend } from "./Friend"

export class About{
    nickName: String
    name: String
    dob: Date
    location: String
    relationship: Friend[]

    constructor(nickName: String,
        name: String,
        dob: Date,
        location: String,
        relationship: Friend[]){
            this.dob = dob;
            this.name = name;
            this.nickName = nickName;
            this.location = location;
            this.relationship = relationship;
    }
}