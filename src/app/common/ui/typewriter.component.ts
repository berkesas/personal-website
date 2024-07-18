import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    standalone: true,
    selector: 'app-typewriter',
    template: `<div [innerHTML]="displayedText"></div>`
})

export class TypewriterComponent implements OnInit {
    @Input() content!: string;
    @Input() id!: number;
    @Output() messageEvent = new EventEmitter<number>();
    readonly speedFactor = 6000;
    safeContent!: SafeHtml;
    displayedText: string = '';
    currentIndex: number = 0;
    interval!: number;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.interval = Math.ceil(this.speedFactor / (this.content.length + 1));
        if(this.interval>50) this.interval = 50;
        // console.log(this.content.length);
        // console.log(this.interval);
        this.typeWriter();
    }

    typeWriter(): void {
        if (this.currentIndex < this.content.length) {
            this.displayedText += this.content.charAt(this.currentIndex);
            this.currentIndex++;
            setTimeout(() => this.typeWriter(), this.interval); // Adjust the delay as needed
        } else {
            this.messageEvent.emit(this.id);
        }
    }
}