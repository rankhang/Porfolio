import { Component, Input, OnInit } from '@angular/core';
import { Name } from 'src/app/name';

@Component({
  selector: 'app-post-audience-template',
  templateUrl: './post-audience-template.component.html',
  styleUrls: ['./post-audience-template.component.css']
})
export class PostAudienceTemplateComponent implements OnInit {
  publicAudience = Name.PUBLIC;
  onlyMeAudience = Name.ONLYME;
  friendsAudience = Name.FRIENDS;
  friendsExceptAudience = Name.FRIENDS_EXCEPT;
  specificFriendsAudience = Name.SPECIFIC_FRIENDS;
  postAudienceTemplate = Name.POST_AUDIENCE_TEMPLATE;
  createNewPostAudienceTemplate = Name.CREATE_NEW_POST_AUDIENCE_TEMPLATE;
  @Input() postAudience: string = "";
  @Input() for: string = "";
  constructor() { }

  ngOnInit(): void {
  }

}
