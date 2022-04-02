import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { BehaviorSubject} from "rxjs";

@Injectable({
    providedIn:'root'
})
export class SlackChatService{


    nameSpaceRoomsChatHistory = new BehaviorSubject<any>(null);
    currentUserName = new BehaviorSubject<string>('');
    portNumber : string = '9000';
    mozillaRoomsDetails :any;
    linuxRoomsDetails : any;
    wikipediaRoomsDetails : any;
    roomStrength = new BehaviorSubject<any>(null);
    currentRoomChatsArr = new BehaviorSubject<any>(null);
    connection : any;
    
    createConnection(endpointNameSpace :  string){
        return this.getCurrentRoomName(endpointNameSpace);   
    }

    getDataFromServer() : Promise<any>{
        let connection = io.connect('http://localhost:' + this.portNumber);
        return new Promise((resolve , reject)=>{
            let output : any;
            connection.on('joining', (msg : any)=>{
                if(msg){
                   output = msg;  
                   resolve(output); 
                }
            });
            
        })
    }

    async sendingNotificationOnJoiningROom(nameSpace : string , roomName : string) : Promise<any>{
        let chatHistory : any;
        let roomStrength : any;
        let resp :any;
        resp = await new Promise((resolve , reject)=>{
        this.connection.emit('joinedroom' , {
            roomName :  roomName ,
            nameSpace : nameSpace
        }, (updateChatHistory : any)=>{
            if(updateChatHistory != null){
                chatHistory = updateChatHistory;
                if(chatHistory && roomStrength != null){
                    resolve({
                        roomStrength : roomStrength,
                        chatHistory : chatHistory
                    })
                }
                resolve(null);
            }
            resolve(null);
        }).on('updateMembers' , (memberCount : any)=>{
            if(memberCount != null){
                this.roomStrength.next(memberCount);
               roomStrength = memberCount;
            }
        });
     })
   
        return new Promise((resolve , reject)=>{
            resolve({
                roomStrength : resp && resp['roomStrength'] != null ? resp['roomStrength'] : null,
                chatHistoryObj : resp && resp['chatHistory']!= null ? resp['chatHistory'] : null
            });
        })
    }

    // async getUpdatedCountAndDetailsOnJoining(nameSpace : string) : Promise<any>{
    //     let connection  = io.connect('http://localhost:' + this.portNumber + nameSpace);
    //     return new Promise((resolve ,reject)=>{
    //         connection.on('updateMembers',(memberCount : any)=>{
    //             console.log(memberCount);
    //             if(memberCount!= null){
    //                 console.log(memberCount);
    //                 this.roomStrength.next(memberCount);
    //                 resolve(memberCount);
    //             }
    //             resolve(null);
    //         })
    //     });
        
    // }

    getCurrentRoomName(nameSpace : string){
            let connection = io.connect('http://localhost:' + this.portNumber + nameSpace);
            this.connection = connection;
           return new Promise((resolve ,reject)=>{
            try{
                connection.on('onjoinednamespace' , (roomArr :any)=>{
                    if(roomArr && roomArr.data){
                        if(nameSpace == '/wiki'){
                            this.wikipediaRoomsDetails = roomArr.data;
                        }else if(nameSpace == '/linux'){
                            this.linuxRoomsDetails = roomArr.data;
                        }else{
                            this.mozillaRoomsDetails = roomArr.data;
                        }
                        resolve(roomArr.data);
                    }
                    resolve(null);
                });
            }catch(e){
                console.log(e);
                resolve(null);
            }    
            
           });       
    }

  sendingMessageToServerFromRoom(nameSpace : string , chatObj : any){
        let chatResponseArr : any;
        this.connection.emit('messageToServer' , chatObj)
        .on('messageToClients' , (data : any)=>{
            console.log(data);
            if(data){
                console.log(data);
                this.currentRoomChatsArr.next(data);
                chatResponseArr = data;
             }
         });
    }

    gettingUpdatedChats(nameSpace: string){
        let connection = io.connect('http://localhost:' + this.portNumber + nameSpace);
        connection.on('messageToClients', (data : any)=>{
            console.log(data);
            if(data){
                this.currentRoomChatsArr.next(data);
            }
        })
    }
}