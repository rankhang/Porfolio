import { Component, Inject, Injectable, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-error-message-modal',
  templateUrl: './error-message-modal.component.html',
  styleUrls: ['./error-message-modal.component.css']
})


export class ErrorMessageModalComponent implements OnInit, OnChanges{
  // @Input() errorMessage: string = "";
  // @Input() errorCode: string = "";
  errorMessage = "";
  errorCode = "";
  errorSolution = "";
  isLogginSuccess = false;
  constructor(public dialogRef: MatDialogRef<ErrorMessageModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.errorMessage = data.errorMessage;
    this.errorCode = data.errorCode;
    this.errorSolution = data.errorSolution;
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if(this.errorMessage =="Logged In Success"){
      this.isLogginSuccess = true;
    }
  }

  //Close the error message
  onCloseErrorMessage(){
    this.dialogRef.close();
  }

  

}
