import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SlackChatService } from '../slack-chat.service';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  constructor(private slackChatService: SlackChatService, private fb: FormBuilder) { }
  @Input() currentRoomName: string = '';
  @Input() countForRooms: number = 1;
  @Input() currentUserName: any;
  @Input() currentNameSpaceName: any;
  @Input() joinedRoomChatHistory: any;
  noStoredChatsAvial: boolean = true;
  searchBar: any;
  currentMessage: string = '';
  chatObject: any = [];
  searchString: string = '';
  noChatFound: string = 'No Chats Related Found!';
  backupHisObj: any;

  ngOnInit(): void {
    
    this.buildForm();

    let chatObj = {
      currentChatMessage: '',
      currentTime: this.convertTimeTOStandardFormat(new Date().getHours(), new Date().getMinutes()),
      currentUserName: this.currentUserName,
      currentRoomName: this.currentRoomName,
      currentNameSpace: this.currentNameSpaceName,
    }
    this.currentMessage = '';
    this.slackChatService.sendingMessageToServerFromRoom(this.currentNameSpaceName, chatObj);
    this.slackChatService.currentRoomChatsArr.subscribe(currenRoomChatObj => {
      this.joinedRoomChatHistory = currenRoomChatObj;
    });

    this.backupHisObj = this.joinedRoomChatHistory;
  }

  buildForm() {
    this.searchBar = this.fb.group({
      searchString: new FormControl('')
    })
  }

  onSearch() {
    let hisObj = this.backupHisObj;
    let sampleArr = [];
    let searchString = this.searchBar.get('searchString').value;
    if (searchString && hisObj) {
      for (let i = 0; i < hisObj['historyArr'].length; i++) {
        if (hisObj['historyArr'][i]['currentChatMessage'].toLowerCase().indexOf(searchString.toLowerCase()) != -1) {
          sampleArr.push(hisObj['historyArr'][i]);
        }
      }
      this.joinedRoomChatHistory['historyArr'] = sampleArr;
    } else {
      if (this.backupHisObj) {
        this.joinedRoomChatHistory['historyArr'] = this.backupHisObj['historyArr'];
      }
    }
  }

  onEnteringMessage(event: any) {
    if (event) {
      if (event.keyCode == 13) {
        this.sendMessageToClient();
      }
    }
  }

  convertTimeTOStandardFormat(hours: any, minutes: any): string {
    minutes = minutes > 9 ? minutes : '0' + minutes;
    if (hours != null && minutes != null) {
      return hours <= 12 ? new Date().toLocaleDateString() + ', ' + hours + ':' + minutes + ' am' :
        new Date().toLocaleDateString() + ', ' + (hours - 12) + ':' + minutes + ' pm';
    }
    return '';
  }

  async sendMessageToClient() {
    if (this.currentMessage) {
      let chatObj = {
        currentChatMessage: this.currentMessage,
        currentTime: this.convertTimeTOStandardFormat(new Date().getHours(), new Date().getMinutes()),
        currentUserName: this.currentUserName,
        currentRoomName: this.currentRoomName,
        currentNameSpace: this.currentNameSpaceName,
      }
      this.currentMessage = '';
      this.chatObject.push(chatObj);
      this.slackChatService.sendingMessageToServerFromRoom(this.currentNameSpaceName, chatObj);
      this.slackChatService.currentRoomChatsArr.subscribe(response => {
        if (response) {
          this.joinedRoomChatHistory = response;
        }
      });
      this.backupHisObj = this.joinedRoomChatHistory;
    }
  }

}
