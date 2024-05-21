import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, updateProfile, User } from 'firebase/auth';
import { collection, doc, Firestore, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, StorageReference, uploadString } from 'firebase/storage';
import { NgToastService } from 'ng-angular-popup';
import { uploadPhotoService } from 'src/app/photo-upload.service';

@Component({
  selector: 'app-game-setting',
  templateUrl: './game-setting.component.html',
  styleUrls: ['./game-setting.component.css']
})
export class GameSettingComponent implements OnInit {
  imagePath: any;
  
  uploadPicUrl:any = '' ; //string|null|ArrayBuffer
  
  @Input() db!: Firestore 
  @Input() auth!:Auth 
  @Input() user!:User|null
  @Input() firebaseApp!: FirebaseApp
  @Input() profilePicUrl: any;
  @Input() storageRef!:StorageReference;
  isUploadNewPic = false;
  isEditButtonClicked = false;
  isEditDoneButtonClicked = false;
  @Input() userFirstName: string = '';
  @Input() userLastName: string = '';


  isLoading = false;
 

 

  constructor(private toast: NgToastService, fb: FormBuilder) {
    
    
  }
  

  onSelectFile(event:any) {
    
    
    
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imagePath = event.target!.result;
        this.isUploadNewPic = true;
        
        
      }
    }
  }
  

  
 

  ngOnInit(): void {
  }


  onCloseClicked(){
    this.isUploadNewPic = false;
    this.imagePath = null;
    this.isEditButtonClicked = false;
  }

  onEditClicked(){
    this.isEditButtonClicked = true;
  }
  

  async onChangeSubmit(form: any){
    this.isLoading = true;
    //If new pic is uploaded
    await uploadPhotoService.uploadNewPic(this.firebaseApp, true, this.storageRef, this.user!, this.imagePath, this.toast,
    this.db);
    //If last or first name updated
    await this.updateName(form);
    this.isLoading = false;
  }

  async toastMessage(){
    this.toast.success({detail:'Changed successfully'});
  }

  async updateName(form: any){
    
    const userColRef = collection(getFirestore(this.firebaseApp), "User");
    const userDocRef = doc(userColRef, this.user!.uid);


    if(form.fname != ''){
      await updateDoc(userDocRef, {
        fname: form.fname
      }).then((e)=>{
        this.toastMessage();
        this.isLoading = false; 
      }).catch(()=>{
        this.toast.error({detail:'Update failed'})
      });
    }
    if(form.lname != ''){
      
      await updateDoc(userDocRef, {
        lname: form.lname
      }).then((e)=>{
        this.toastMessage();
        this.isLoading = false; 
      }).catch(()=>{
        this.toast.error({detail:'Update failed', duration: 500})
      });
    }
  }

  // async uploadNewPic(){
  //   if(this.isUploadNewPic){
  //     const storage = getStorage(this.firebaseApp);
  //     this.storageRef = ref(storage, this.user?.email + '/profilePicture/' + this.user?.uid);
  //     try{
  //       await uploadString(this.storageRef, this.imagePath, 'data_url').then((snapshot) => {
          
  //         // Get the download URL
  //           getDownloadURL(this.storageRef)
  //           .then((url) => {
  //             this.toastMessage();
  //             this.isLoading = false;
  //             // this.profilePicUrl = url;
  //             updateProfile(this.user!, {
  //               photoURL: url
  //             }).catch((e)=>{
  //               console.log(e);
  //             });
              
              
  //           })
  //           .catch((error) => {
  //             // A full list of error codes is available at
  //             // https://firebase.google.com/docs/storage/web/handle-errors
  //             switch (error.code) {
  //               case 'storage/object-not-found':
                  
  //                 break;
  //               case 'storage/unauthorized':
  //                 // User doesn't have permission to access the object
                  
  //                 break;
  //               case 'storage/canceled':
  //                 // User canceled the upload
                  
  //                 break;
  //               case 'storage/unknown':
  //                 // Unknown error occurred, inspect the server response
                  
  //                 break;
  //             }
  //           });
  //             });
  //     }catch(e){
  //       this.toast.error({detail:'Upload failed' + e});
  //     }
  //   }
    
    
  // }

}
