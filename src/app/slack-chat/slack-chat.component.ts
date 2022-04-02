import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { SlackChatService } from './slack-chat.service';
import { UserJoinDailogComponent } from './user-join-dailog/user-join-dailog.component';

@Component({
  selector: 'app-slack-chat',
  templateUrl: './slack-chat.component.html',
  styleUrls: ['./slack-chat.component.css']
})
export class SlackChatComponent implements OnInit{

  constructor(private slackChatService : SlackChatService, private matDialog : MatDialog, private cdr : ChangeDetectorRef) { }
  currentRoomsDisplay : any;
  currentNameSpaceString : string = '';
  currentRoomSelected : string = '';
  roomSelected : boolean = false;
  currentUserName : any;
  currentCount : any;
  joinedRoomChatHistory : any;
  @ViewChild(ChatWindowComponent) chatWinComp : ChatWindowComponent = {} as ChatWindowComponent ;
  ngOnInit(): void {
    this.openDailog();
  }

  openDailog(){
    const dailogConfig = new MatDialogConfig();
    this.matDialog.open(UserJoinDailogComponent
      , {
        disableClose : true,
        autoFocus: true
      }).afterClosed().subscribe(currentUserName=>{
      if(currentUserName){
        this.currentUserName = currentUserName;
        this.slackChatService.currentUserName.next(currentUserName);
        this.joingDefaltNameSpace();
      } 
  });
}

  joingDefaltNameSpace(){
    this.slackChatService.getDataFromServer().then(res=>{
      if(res){
        this.hitDifferentNameSpaces('wikipedia');
      }
    });
  }

  hitDifferentNameSpaces(nameSpaceString : string){
      if(nameSpaceString){
          this.onClickNameSpace(nameSpaceString)?.then((roomsArr: any)=>{
              if(roomsArr){
                this.currentRoomsDisplay = roomsArr;
                this.showChatDisplayForRoom(roomsArr[0]);
              }
          });
      }
  }

  onClickNameSpace(nameSpaceString : string){
    if(nameSpaceString){
      this.currentNameSpaceString = nameSpaceString;
      if(nameSpaceString == 'wikipedia'){
        this.currentNameSpaceString = '/wiki';
        return this.slackChatService.createConnection('/wiki');
      }else if(nameSpaceString == 'linux'){
        this.currentNameSpaceString = '/linux';
        return this.slackChatService.createConnection('/linux');
      }else{
        this.currentNameSpaceString = '/mozilla';
        return this.slackChatService.createConnection('/mozilla');
      }
    }
    return null;
  }

  async showChatDisplayForRoom(room: string){
    if(room){
      this.currentRoomSelected = room;
      let slackChatHistory = await this.slackChatService.sendingNotificationOnJoiningROom(this.currentNameSpaceString , this.currentRoomSelected);
      if(slackChatHistory ){
        let response = slackChatHistory.chatHistoryObj;
        this.joinedRoomChatHistory = response;
        this.slackChatService.currentRoomChatsArr.next(this.joinedRoomChatHistory);
      }
      this.slackChatService.roomStrength.subscribe((roomStrength : any)=>{
        if(roomStrength!= null){
           this.currentCount = roomStrength;
        }
        if(!this.currentCount){
          this.currentCount = slackChatHistory.roomStrength;
        }
      });
      this.roomSelected = true;
      this.cdr.detectChanges();  
      if(this.chatWinComp){
        this.chatWinComp.ngOnInit();
      }
    }

  }

}
