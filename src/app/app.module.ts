import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SlackChatComponent } from './slack-chat/slack-chat.component';
import { SlackChatService } from './slack-chat/slack-chat.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SlackChatModule } from './slack-chat/slack-chat.module';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    SlackChatModule,
    MatDialogModule
  ],
  providers: [SlackChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
