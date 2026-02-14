import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../services/socket.service';

type Message = { username: string; message: string; timestamp: string; type?: 'chat' | 'system' };

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {
  username = '';
  message = '';
  connected = false;
  messages: Message[] = [];

  private sub: any;
  private joinSub: any;
  private leaveSub: any;

  constructor(private socket: SocketService) {}

  ngOnInit() {
    this.subscribeToMessages();
    this.subscribeToJoinLeave();
  }

  private subscribeToMessages() {
    if (this.sub) return;
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

  private subscribeToJoinLeave() {
    this.joinSub = this.socket.onUserJoined().subscribe((data) => {
      this.messages.push({
        username: data.username,
        message: 'joined the chat',
        timestamp: data.timestamp,
        type: 'system'
      });
      setTimeout(() => this.scrollToBottom(), 0);
    });

    this.leaveSub = this.socket.onUserLeft().subscribe((data) => {
      this.messages.push({
        username: data.username,
        message: 'left the chat',
        timestamp: data.timestamp,
        type: 'system'
      });
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  connectIfNeeded(): boolean {
    if (this.connected) return true;
    const name = this.username.trim();
    if (!name) return false;
    this.socket.connect(name);
    this.connected = true;
    this.subscribeToMessages();
    return true;
  }

  send() {
    const text = this.message.trim();
    if (!text) return;
    if (!this.connectIfNeeded()) return;
    const username = this.username.trim();
    const localMsg = { username, message: text, timestamp: new Date().toISOString() } as Message;
    this.messages.push(localMsg);
    this.socket.sendMessage(username, text);
    this.message = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  isOwn(m: Message): boolean {
    const current = this.username && this.username.trim();
    if (!current) return false;
    return m.username === current;
  }

  getInitials(name?: string): string {
    const n = (name || '').trim();
    if (!n) return '?';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  scrollToBottom() {
    const el = document.querySelector('.messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  isSystemMessage(m: Message): boolean {
    return m.type === 'system';
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.joinSub?.unsubscribe();
    this.leaveSub?.unsubscribe();
    this.socket.disconnect();
  }
}
