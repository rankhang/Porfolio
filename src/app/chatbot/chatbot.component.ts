import { Component, OnInit } from '@angular/core';
// import { Interactions } from 'aws-amplify';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  isUploadNewPic = false;
  imagePath: any;
  isEditButtonClicked = false;
  conversation: string = 'Bot: Hi, how can I help you?';
  message!: string;
  constructor() { }

  ngOnInit(): void {
  }


  onCloseClicked(){
    this.isUploadNewPic = false;  
    this.imagePath = null;
    this.isEditButtonClicked = false;
  }

  async startChat() {
    // // Provide a bot name and user input
    // this.conversation = this.conversation + "\nYou: " + this.message;
    // var response = await Interactions.send("RetailOrderManagement", this.message.toString());
    // //Log chatbot response
    // console.log(response);
    // this.message = '';
    // if(response && response['message']){
    //   this.conversation = this.conversation + "\nBot: " + response['message']
    // }
    // if(response && !response['message']){
    //   this.conversation = this.conversation + "\nBot: " + "Your Hotel Room Booking is complete."
    // }
  }
}
