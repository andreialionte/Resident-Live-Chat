import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  connect(username: string) {
    if (this.socket && this.socket.connected) return;
    this.socket = io('http://localhost:3000');
    this.socket.emit('user-connected', username);
  }

  sendMessage(username: string, message: string) {
    if (!this.socket) return;
    this.socket.emit('send-message', { username, message });
  }

  onNewMessage(): Observable<{ username: string; message: string; timestamp: string }> {
    return new Observable((subscriber) => {
      this.socket.on('new-message', (data: any) => subscriber.next(data));
      return () => this.socket.off('new-message');
    });
  }

  disconnect() {
    this.socket?.disconnect();
  }
}
