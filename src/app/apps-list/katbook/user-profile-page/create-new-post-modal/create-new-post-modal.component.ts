import { Output, EventEmitter ,Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MainUser } from '../../models/MainUser';
import { KatBookHomepageComponent } from '../../homepage/homepage.component';
import { Post } from '../../models/Post';
import { Name } from 'src/app/name';
import { FormBuilder, Validators } from '@angular/forms';
import { limitToFirst } from 'firebase/database';
import { logEvent } from 'firebase/analytics';
import { Photo } from '../../models/Photo';
import { GenerateRandomNum } from 'src/app/generate-random-number.service';
import { CreateAccountService } from 'src/app/firebase/createAccountService';
import { Friend } from '../../models/Friend';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Firestore } from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { uploadPhotoService } from 'src/app/photo-upload.service';
import { FirebaseApp } from '@angular/fire/app';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageModalComponent } from 'src/app/error-message-modal/error-message-modal.component';


@Component({
  selector: 'app-create-new-post-modal',
  templateUrl: './create-new-post-modal.component.html',
  styleUrls: ['./create-new-post-modal.component.css']
})
export class CreateNewPostModalComponent implements OnInit {
  @Input() mainUserMetaData: MainUser | undefined;
  @Input() db: Firestore | undefined;
  @Input() auth: Auth | undefined
  @Input() firebaseApp: FirebaseApp | undefined
  @Input() user!: User | null
  
  @Output() updatePosts = new EventEmitter<Post>();
  
  @ViewChild('emptyPostWarning') emptyPostWarning: ElementRef | undefined;
  @ViewChild('closePostModal') closePostModal: ElementRef | undefined;

  userPosts: Post[] | undefined;
  newPost!: Post;
  publicAudience = Name.PUBLIC;
  onlyMeAudience = Name.ONLYME;
  friendsAudience = Name.FRIENDS;
  friendsExceptAudience = Name.FRIENDS_EXCEPT;
  specificFriendsAudience = Name.SPECIFIC_FRIENDS;
  createNewPostAudienceTemplate = Name.CREATE_NEW_POST_AUDIENCE_TEMPLATE;
  postAudience: string = this.publicAudience; //public as default
  isPhotoIconClick = false;
  isTextEditIconClick = true;
  postText = "";
 

  newPostPhotos: Photo[] = [];
  isChosenPostPhotoUpload = false;
  chosenPostPhotosArray: Array<any> = [];
  compressedPostPhotosArray: Array<any> = [];



  //Audience Form
  audienceForm = this.builder.group({
    audience: this.builder.control(this.postAudience)
    // audience: ['',Validators.required]
  });
  constructor(private dialogRef: MatDialog,private builder: FormBuilder, private ng2ImgMax: Ng2ImgMaxService, private toast: NgToastService) {




  }


  ngOnInit(): void {
  }

  

  onSubmitAudience() {
    console.log(this.audienceForm.value.audience?.toString());
    this.postAudience = this.audienceForm.value.audience?.toString()!;
  }


  onPhotoClick() {
    this.isPhotoIconClick = true;
    this.isTextEditIconClick = false;
  }

  onTextClick() {
    this.isPhotoIconClick = false;
    this.isTextEditIconClick = true;
  }

  async onPhotoUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file: File = event.target.files[i];

        //Get photo object
        let picID = CreateAccountService.makeid(5);
        console.log(picID);

        const photoObject = new Photo(picID + "-" + file.name, "", new Date(), "");

        this.newPostPhotos?.push(photoObject);
        console.log(this.newPostPhotos);

        //compress the file to reduce the size
        const percentageReduction = 0.50;
        const targetFileSize = file.size * (1 - percentageReduction);
        const maxSizeInMB = targetFileSize * 0.000001;
        this.compressImage(file, maxSizeInMB);

        let chosenPostPhoto: any;


        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          chosenPostPhoto = event.target!.result;

          this.chosenPostPhotosArray.push(chosenPostPhoto);
        }

      }
      this.isChosenPostPhotoUpload = true;
    }

  }

  compressImage(file: File, maxSizeInMB: number) {
    this.ng2ImgMax.compressImage(file, maxSizeInMB)
      .subscribe(compressedImage => {

        //read the compressed image before uploading it to db
        var reader = new FileReader();
        reader.readAsDataURL(compressedImage); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.compressedPostPhotosArray.push(event.target!.result);
        }
      }, error => {
        console.log(error);
      });
  }


  async onUploadNewPost() {
    if (this.postText != '' || this.newPostPhotos.length != 0) {
      
      const postId = CreateAccountService.makeid(10);
      const newPost = new Post(new Date(),this.mainUserMetaData?.fname! + " " + this.mainUserMetaData?.lname! ,this.postAudience, this.postText, this.newPostPhotos, this.mainUserMetaData?.uid!, postId, this.mainUserMetaData?.profilePhotoURL!);
      const storagePath = 'katbook/' + this.mainUserMetaData?.uid + this.mainUserMetaData?.email + '/Posts/' + postId + '/';
      await uploadPhotoService.uploadPhoto(this.firebaseApp!, this.user!, this.db!, storagePath, newPost, this.mainUserMetaData!, this.compressedPostPhotosArray, this.toast);
      //Update its parent companent
      console.log(newPost);
      
      this.updatePosts.emit(newPost);

      //Clear data
      this.postText = "";
      this.chosenPostPhotosArray= [];
      this.compressedPostPhotosArray = [];
      this.postAudience = this.publicAudience; // default
      this.newPostPhotos = [];
      this.isChosenPostPhotoUpload = false;
      
      
      this.closePostModal?.nativeElement.click();
    }else{
      this.emptyPostWarning?.nativeElement.click();
    }





    // //Upload new post to DB
    // const newPostDocRef = doc(this.db!, Name.USER,this.mainUserMetaData?.uid!,"Posts",postId );
    // //Set post metadata
    // await setDoc(newPostDocRef,{
    //   postAudience: this.postAudience, 
    //   postBody: this.postText,
    //   ownerID: this.mainUserMetaData?.uid!,
    // }  );
    // //upload photo(s) metadata to DB
    // if(this.newPostPhotos != undefined && this.newPostPhotos.length > 0){
    //   for(let i = 0 ; i< this.newPostPhotos.length; i++){
    //     let aPhoto = this.newPostPhotos[i];
    //     const photoColRef = collection(newPostDocRef, "Photos");
    //     await setDoc(doc(photoColRef, aPhoto.id),{
    //       photoDescription: aPhoto.description,
    //       date: aPhoto.date
    //     });
    //   }
    //   //Upload photo(s) to cloud storage

    // }



  }

}
