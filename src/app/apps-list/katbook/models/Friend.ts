export class Friend{
    name: String;
    manualFriendNumber: number;
    profilePicID:String;
    uid: String;

    constructor(name: String,
        manualFriendNumber: number,
        profilePicID:String,
        uid: String){
            this.name = name;
            this.manualFriendNumber = manualFriendNumber;
            this.profilePicID = profilePicID;
            this.uid = uid;
    }

}