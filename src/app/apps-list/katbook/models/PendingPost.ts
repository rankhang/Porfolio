import { Post } from "./Post";

export class PendingPost{
    post:Post[];

    constructor(post:Post[]){
        this.post= post;
    }
}