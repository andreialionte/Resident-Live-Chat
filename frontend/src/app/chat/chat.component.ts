import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../services/socket.service';

type Message = { username: string; message: string; timestamp: string };

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  username = '';
  message = '';
  connected = false;
  messages: Message[] = [];

  private sub: any;

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.connectIfNeeded();
    this.sub = this.socket.onNewMessage().subscribe((m) => {
      const duplicate = this.messages.some((msg) =>
        msg.username === m.username &&
        msg.message === m.message &&
        Math.abs(new Date(msg.timestamp).getTime() - new Date(m.timestamp).getTime()) < 5000
      );
      if (!duplicate) {
        this.messages.push(m);
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  connectIfNeeded() {
    if (this.connected) return;
    const name = this.username.trim() || 'Anonim';
    this.socket.connect(name);
    this.connected = true;
  }

  send() {
    const text = this.message.trim();
    if (!text) return;
    this.connectIfNeeded();
    const username = this.username.trim() || 'Anonim';
    const localMsg = { username, message: text, timestamp: new Date().toISOString() } as Message;
    this.messages.push(localMsg);
    this.socket.sendMessage(username, text);
    this.message = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  scrollToBottom() {
    const el = document.querySelector('.messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.socket.disconnect();
  }
}
