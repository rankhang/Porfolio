import { Account } from "src/app/models/account.model";
import { Post } from "./Post";
import { Friend } from "./Friend";
import { Photo } from "./Photo";

export class MainUser extends Account{
    pendingPost?: Post[];
    friendRequest?: Friend[];
    notification?: Notification[];


    constructor(email: string|null, fname : string, lname: string, joinedDate: Date, uid?: string,posts?: Post[],
        friends?: Friend[], // will need to update to graph structure
        photos?: Photo[],
        pendingPost?: Post[],
        friendRequest?: Friend[],
        notification?: Notification[]
       ){
        super(email, fname, lname, joinedDate, uid,posts,
            friends, // will need to update to graph structure
            photos);
        
        this.pendingPost = pendingPost;
        this.friendRequest = friendRequest;
        this.notification = notification;
    }
}