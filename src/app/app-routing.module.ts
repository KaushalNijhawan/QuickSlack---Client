import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlackChatComponent } from './slack-chat/slack-chat.component';

const routes: Routes = [{path : 'slack-app', component: SlackChatComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
