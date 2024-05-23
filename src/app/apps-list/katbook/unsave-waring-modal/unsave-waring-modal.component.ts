import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsave-waring-modal',
  templateUrl: './unsave-waring-modal.component.html',
  styleUrls: ['./unsave-waring-modal.component.css']
})
export class UnsaveWaringModalComponent implements OnInit {
  message = "";
  code = "";
  solution = "";
  constructor(public dialogRef: MatDialogRef<UnsaveWaringModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.message = data.message;
      this.code = data.code;
      this.solution = data.solution;
   }

  ngOnInit(): void {
  }

}
