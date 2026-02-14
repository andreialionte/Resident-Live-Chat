import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: Socket;
  private registeredUsername?: string;

  private ensureSocket(): Socket {
    if (!this.socket) {
      this.socket = io('http://localhost:3000');
      this.socket.on('invalid-username', (info) => console.error('invalid-username', info));
      this.socket.on('username-mismatch', (info) => console.error('username-mismatch', info));
      this.socket.on('not-connected', (info) => console.error('not-connected', info));
    }
    return this.socket;
  }

  connect(username: string) {
    const name = (username || '').trim();
    if (!name) return;
    const s = this.ensureSocket();
    if (this.registeredUsername) return;
    s.emit('user-connected', name);
    this.registeredUsername = name;
  }

  sendMessage(username: string, message: string) {
    if (!this.socket) return;
    this.socket.emit('send-message', { username, message });
  }

  onNewMessage(): Observable<{ username: string; message: string; timestamp: string }> {
    const s = this.ensureSocket();
    return new Observable((subscriber) => {
      s.on('new-message', (data: any) => subscriber.next(data));
      return () => s.off('new-message');
    });
  }

  onUserJoined(): Observable<{ username: string; timestamp: string }> {
    const s = this.ensureSocket();
    return new Observable((subscriber) => {
      s.on('user-joined', (data: any) => subscriber.next(data));
      return () => s.off('user-joined');
    });
  }

  onUserLeft(): Observable<{ username: string; timestamp: string }> {
    const s = this.ensureSocket();
    return new Observable((subscriber) => {
      s.on('user-left', (data: any) => subscriber.next(data));
      return () => s.off('user-left');
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
    this.registeredUsername = undefined;
  }
}
