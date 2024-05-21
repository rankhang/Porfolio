import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create-new-post-modal',
  templateUrl: './create-new-post-modal.component.html',
  styleUrls: ['./create-new-post-modal.component.css']
})
export class CreateNewPostModalComponent implements OnInit {
  @Input() mainUserMetaData: MainUser | undefined;
  userPosts: Post[] | undefined;
  newPost!: Post;
  publicAudience = Name.PUBLIC;
  onlyMeAudience = Name.ONLYME;
  friendsAudience = Name.FRIENDS;
  friendsExceptAudience = Name.FRIENDS_EXCEPT;
  specificFriendsAudience = Name.SPECIFIC_FRIENDS;
  postAudience: string = this.publicAudience; //public as default
  isPhotoIconClick = false;
  isTextEditIconClick = true;
  postText = "";

  newPostPhotos!: Photo[]
  isChosenPostPhotoUpload = false;
  chosenPostPhotosArray: Array<any> = [];



  //Audience Form
  audienceForm = this.builder.group({
    audience: this.builder.control(this.postAudience)
    // audience: ['',Validators.required]
  });
  constructor(private builder: FormBuilder) {
    

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

        //Get photo object
        const photoObject = new Photo(event.target.files[i].name,"", new Date());

        let chosenPostPhoto: any;
        

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          chosenPostPhoto = event.target!.result;
          this.chosenPostPhotosArray.push(chosenPostPhoto);
        }
        this.newPostPhotos.push(photoObject);
      }
      this.isChosenPostPhotoUpload = true;
    }
    
  }


  onUploadNewPost(){


    const postId = CreateAccountService.makeid(10);
    const newPost = new Post(this.postAudience, this.postText, this.newPostPhotos, this.mainUserMetaData?.uid!, postId);
    
  }

}
