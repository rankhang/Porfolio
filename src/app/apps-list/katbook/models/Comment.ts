import { Friend } from "./Friend";

export class Comment{
    text: String;
    by: Friend

    constructor(text: String, by: Friend){
        this.text = text;
        this.by = by;
    }
}