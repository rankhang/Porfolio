import { Friend } from "../apps-list/katbook/models/Friend";
import { Photo } from "../apps-list/katbook/models/Photo";
import { Post } from "../apps-list/katbook/models/Post";

export class Account{
    uid?: string
    email: string|null;
    fname: string;
    lname: string;
    joinedDate: Date;
    posts?: Post[];
    friends?: Friend[]; // will need to update to graph structure
    photos?: Photo[];

    

    constructor(email: string|null, fname : string, lname: string, joinedDate: Date, uid?: string,posts?: Post[],
        friends?: Friend[], // will need to update to graph structure
        photos?: Photo[]
       ){
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.joinedDate = joinedDate;
        this.posts = posts;
        this.photos = photos;
        this.uid = uid;
    }

    

    // constructor(posts: Post[],email: string, fname : string, lname: string, joinedDate: Date,
    //     friends: Friend[], // will need to update to graph structure
    //     photos: Photo[],
    //     pendingPost: Post[],
    //     friendRequest: Friend[],
    //     notification: Notification[]){
    //     this.email = email;
    //     this.fname = fname;
    //     this.lname = lname;
    //     this.joinedDate = joinedDate;
    //     this.posts = posts;
    // }
}