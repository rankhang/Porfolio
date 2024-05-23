export class Photo{
    id: string;
    description: string;
    date: Date;
    url: string


    constructor(id: string,
        description: string,
        date: Date, url:string){
            this.date = date;
            this.id = id;
            this.description = description;
            this.url = url;
        }
}