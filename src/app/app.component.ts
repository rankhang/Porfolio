import { Component, OnChanges, OnInit, SimpleChanges, Input, inject, Inject } from '@angular/core';
// import { Interactions } from 'aws-amplify';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent{
  
  title = " Khang Nguyen's Portfolio";
 
  
    constructor(private router: Router) { }
    ngOnInit(): void {
    }
 

 
}
