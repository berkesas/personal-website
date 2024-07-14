import { Component } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenDate',
  standalone: true,
})

export class ShortenDatePipe implements PipeTransform {
  transform(date: Date, args?: any): any {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }
}

export interface ChatMessage {
  source: string;
  text: string;
  created: Date;
}

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, ShortenDatePipe],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css',
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '450px',
          // width: '300px',
          opacity: 1,
        }),
      ),
      state(
        'closed',
        style({
          height: '450px',
          // width: '0px',
          opacity: 0,
        }),
      ),
      transition('open => closed', [animate('0.3s ease-out')]),
      transition('closed => open', [animate('0.3s ease-out')]),
    ]),
  ],
})
export class ChatboxComponent {
  // chatWindowVisible: WritableSignal<boolean> = signal(false);
  chatWindowVisible = false;
  conversationHistory: ChatMessage[] = [];

  constructor(readonly appConfig: ConfigService) {
    this.conversationHistory = [];
  }

  ngAfterViewInit() {
    const newMessage = {
      source: 'server',
      text: "Hello! My name is VirtuBot. I am virtual assistant of " + this.appConfig.config?.author,
      created: new Date()
    }
    this.conversationHistory.push(newMessage);
  }

  toggleChat() {
    this.chatWindowVisible = !this.chatWindowVisible;
  }

  chatSubmit(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    console.log('Enter key pressed! Value:', inputElement.value);
    const newMessage = {
      source: 'client',
      text: inputElement.value,
      created: new Date()
    }
    this.conversationHistory.push(newMessage);
    inputElement.value = '';
  }

}