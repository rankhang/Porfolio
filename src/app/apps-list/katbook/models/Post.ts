import { Comment } from "./Comment"
import { Friend } from "./Friend"
import { Photo } from "./Photo"

export class Post{
    postDate: Date;
    ownerName: string
    postAudience: string
    body: string
    photos: Photo[]
    tagPerson?: Friend[]
    ownerID: string
    ownerProfileURL : string
    postID: string
    visibleTo?: Friend[]
    comments?: Comment[]
    numberOfLikes?: number
    likeBy?: Friend[]

    constructor(postDate:Date,ownerName:string,postAudience: string,
        body: string,
        photos: Photo[],
        
        ownerID: string,
        postID: string,
        ownerProfileURL: string,
        tagPerson?: Friend[],
        
        visibleTo?: Friend[],
        comments?: Comment[],
        numberOfLikes?: number,
        likeBy?: Friend[]){
            this.postDate = postDate,
            this.ownerName = ownerName,
            this.photos = photos,
            this.body = body,
            this.postAudience = postAudience,
            this.tagPerson = tagPerson,
            this.ownerID = ownerID,
            this.postID = postID,
            this.visibleTo = visibleTo,
            this.comments = comments,
            this.numberOfLikes = numberOfLikes;
            this.likeBy = likeBy;
            this.ownerProfileURL = ownerProfileURL
    }
}