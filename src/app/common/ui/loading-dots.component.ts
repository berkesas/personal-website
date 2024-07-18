import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-loading-dots',
    template: `
    <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
    `,
    styles: `
        .loading-dots {
        display: flex;
        justify-content: center;
        align-items: center;
        }

        .dot {
        width: 8px;
        height: 8px;
        margin: 0 4px;
        background-color: #333;
        border-radius: 50%;
        animation: dot-blink 1.4s infinite both;
        }

        .dot:nth-child(1) {
        animation-delay: -0.32s;
        }

        .dot:nth-child(2) {
        animation-delay: -0.16s;
        }

        @keyframes dot-blink {
        0%, 80%, 100% {
            opacity: 0;
        }
        40% {
            opacity: 1;
        }
        }
    `,
})
export class LoadingDots {
    /* Component behavior is defined in here */
}