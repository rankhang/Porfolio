import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from '../crypto-trading-game/sign-up/PasswordValidator';
import { Auth, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { MainUser } from './models/MainUser';
import { NgToastService } from 'ng-angular-popup';
import { CreateAccountService } from 'src/app/firebase/createAccountService';
import { Name } from 'src/app/name';
import { SignInService } from 'src/app/firebase/SignInService';
import { AuthService } from 'src/app/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-katbook',
  templateUrl: './katbook.component.html',
  styleUrls: ['./katbook.component.css']
})
export class KatbookComponent implements OnInit {
  signUpForm: FormGroup;
  signInForm: FormGroup;
  route: Router;
  isLoading = false;
  aUser! : MainUser;
  readonly appName = Name.KATBOOK;

  constructor(private authService: AuthService, fb: FormBuilder, route: Router, private toast: NgToastService, private dialogRef: MatDialog) {
    this.route = route;

    this.signInForm = fb.group({
      'email' : ['', Validators.compose([Validators.required, Validators.email])],
      'password' : ['',Validators.required]
    })

    this.signUpForm = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'lname': ['', Validators.required],
      'fname': ['', Validators.required],
      'password': ['', Validators.compose([Validators.required, Validators.min(6)])],
      'retype-password': ['', Validators.compose([Validators.required, Validators.min(6)])]
    }),
    {
      validators: PasswordValidator.passwordMatchValidator
    }
  }

  ngOnInit(): void {
  }

  async onSignUpSubmit(form: FormGroup) {
    this.isLoading = true;
    if (this.signUpForm.valid) {
      const auth = getAuth();
      //create an user object

      this.aUser = new MainUser(form.value.email, form.value.fname, form.value.lname, new Date());
      await CreateAccountService.createAccount(auth, form.value.email, form.value.password,this.toast, this.aUser, this.route, this.isLoading, this.appName, this.authService, form);
    
    }
  }

    onSignInSubmit(form: FormGroup){
      this.isLoading = true;
     SignInService.signIn(form ,this.signInForm, this.authService, this.dialogRef, this.route, Name.KATBOOK);
     this.isLoading = false;
  }

}
