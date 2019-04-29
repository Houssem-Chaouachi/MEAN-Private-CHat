import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  listeUsers: any;
  chosenUser: any;
  listeMessages: any;
  messageForm: FormGroup;
  conversation: any;
  constructor(private socket: Socket, public chatService: ChatService, public userService: UserService) {
    this.listeMessages = [];
    this.listeUsers = [];
    this.messageForm = new FormGroup({
      content: new FormControl(''),
      user: new FormControl(''),
    });
  }

  ngOnInit() {
    this.messageForm = new FormGroup({
      content: new FormControl(''),
      user: new FormControl(this.userService.connectedUser._id),
    });
    this.socket.on('newUserAdded', () => {
      this.userService.getListeUsers().subscribe((res: any) => {
        this.listeUsers = res.filter(obj => obj._id !== this.userService.connectedUser._id);
      });
   });
    this.userService.getListeUsers().subscribe((res: any) => {
      this.listeUsers = res.filter(obj => obj._id !== this.userService.connectedUser._id);
      this.clickUser(this.listeUsers[0]._id);
    });
    this.socket.on('newMessageSended', () => {
       this.clickUser(this.chosenUser);
       console.log('hahahaha');
    });
  }
  clickUser(idUser) {
    this.chosenUser = idUser;
    this.chatService.getPrivateMessage(idUser, this.userService.connectedUser._id).subscribe( (res: any) => {
      console.log(res);
      this.conversation = res._id;
      this.listeMessages = res.messages;
    });
  }
  sendMessage() {
     console.log('clicked');
     this.chatService.sendMessage(this.messageForm.value, this.conversation).subscribe();
  }

}
