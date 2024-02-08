import { Component, OnInit, ViewChild } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from 'src/app/firebase/initialize-firebase';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent implements OnInit {
  
  addFriendForm: FormGroup;
  isSubmitted = false;
  db: Firestore ;
  
 


  constructor(fb: FormBuilder) {
    this.db = getFirestore(initializeFirebase.initialize());

    this.addFriendForm = fb.group({
      'email' : ['', Validators.compose([Validators.required, Validators.email])],
      'lName' :['', Validators.required],
      'fName' : ['', Validators.required],
      'message': ['']
    });

    
   }

  ngOnInit(): void {
  }


  async onAddFriendSubmit(form: FormGroup){
    this.isSubmitted = true;
    
    if(this.addFriendForm.valid){
      try {
        const docRef = await addDoc(collection(this.db, "friends"), {
          first: form.value.fName,
          last: form.value.lName,
          email: form.value.email,
          message: form.value.message
        });

        this.reloadCurrentPage();
        
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    
  }


  reloadCurrentPage() {
    window.location.reload();
   }

}
