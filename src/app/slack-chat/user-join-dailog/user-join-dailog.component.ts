import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SlackChatService } from '../slack-chat.service';

@Component({
  selector: 'app-user-join-dailog',
  templateUrl: './user-join-dailog.component.html',
  styleUrls: ['./user-join-dailog.component.css']
})
export class UserJoinDailogComponent implements OnInit {
  user: any;
  constructor(private slackChatService : SlackChatService, private dialogRef: MatDialogRef<UserJoinDailogComponent>,
    @Inject(MAT_DIALOG_DATA) data : any, private fb : FormBuilder) { 
      this.dialogRef.updateSize('300vw','300vw');
      this.dialogRef.updatePosition({ top: '25', left: '50' });
    }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.user = this.fb.group({
      userName :  new FormControl('',[Validators.required])
    })
 
  }

  clickContinue(){
      this.dialogRef.close(this.user.get('userName').value);
  }
}
