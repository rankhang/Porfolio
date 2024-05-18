import { Component, OnInit } from '@angular/core';
import { MainUser } from '../../models/MainUser';
import { KatBookHomepageComponent } from '../../homepage/homepage.component';
import { Post } from '../../models/Post';
import { Name } from 'src/app/name';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-new-post-modal',
  templateUrl: './create-new-post-modal.component.html',
  styleUrls: ['./create-new-post-modal.component.css']
})
export class CreateNewPostModalComponent implements OnInit {
  mainUserMetaData: MainUser| undefined;
  userPosts: Post[] | undefined;
  publicAudience = Name.PUBLIC; 
  onlyMeAudience = Name.ONLYME;
  friendsAudience = Name.FRIENDS;
  friendsExceptAudience = Name.FRIENDS_EXCEPT;
  specificFriendsAudience = Name.SPECIFIC_FRIENDS;
  postAudience: string = this.publicAudience; //public as default
  isPhotoIconClick = false; 
  isTextEditIconClick = true;
  imagePath: any;
  

  //Audience Form
  audienceForm = this.builder.group({
    audience: this.builder.control(this.postAudience)
    // audience: ['',Validators.required]
  });
  constructor(private builder: FormBuilder) {
    this.mainUserMetaData = KatBookHomepageComponent.mainUser;
    this.userPosts = KatBookHomepageComponent.mainUser?.posts;
    
   }

  ngOnInit(): void {
  }

  onSubmitAudience(){
    console.log(this.audienceForm.value.audience?.toString());
    this.postAudience = this.audienceForm.value.audience?.toString()!;
  }


  
  onPhotoClick(){
    this.isPhotoIconClick = true;
    this.isTextEditIconClick = false;
  }

  onTextClick(){
    this.isPhotoIconClick = false;
    this.isTextEditIconClick = true;
  }

  onPhotoUpload(event: any){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imagePath = event.target!.result;
        
        
        
      }
    }
    
  }

}
