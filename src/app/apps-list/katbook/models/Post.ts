import { Friend } from "./Friend"
import { Photo } from "./Photo"

export class Post{
    postAudience: String
    body: String
    photos: Photo[]
    tagPerson: Friend[]
    ownerID: String
    postID: String
    visibleTo: Friend[]

    constructor(postAudience: String,
        body: String,
        photos: Photo[],
        tagPerson: Friend[],
        ownerID: String,
        postID: String,
        visibleTo: Friend[]){
            this.photos = photos,
            this.body = body,
            this.postAudience = postAudience,
            this.tagPerson = tagPerson,
            this.ownerID = ownerID,
            this.postID = postID,
            this.visibleTo = visibleTo
    }
}