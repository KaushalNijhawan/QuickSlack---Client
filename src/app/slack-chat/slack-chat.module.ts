import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChatWindowComponent } from "./chat-window/chat-window.component";
import { SlackChatComponent } from "./slack-chat.component";
import { SlackChatService } from "./slack-chat.service";
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { UserJoinDailogComponent } from './user-join-dailog/user-join-dailog.component';
import {MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [
      SlackChatComponent,
      ChatWindowComponent,
      UserJoinDailogComponent
    ],
    imports: [
      BrowserModule,
      NgbModule,
      BrowserAnimationsModule,
      FormsModule,
      MatIconModule,
      MatInputModule,
      MatDialogModule,
      ReactiveFormsModule,
      
    ],
    providers: [SlackChatService],
    bootstrap: [SlackChatComponent,ChatWindowComponent]
  })
  export class SlackChatModule { }
  