import { Friend } from "./Friend";

export class Notification{
    type: String;
    by: Friend;

    constructor(type: String,
        by: Friend){
            this.type = type;
            this.by = by;
    }
}