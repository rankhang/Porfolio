export class Photo{
    id: String;
    description: String;
    date: Date;


    constructor(id: String,
        description: String,
        date: Date){
            this.date = date;
            this.id = id;
            this.description = description;
        }
}