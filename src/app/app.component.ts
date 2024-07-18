import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser,CommonModule } from "@angular/common";
import { initFlowbite } from 'flowbite';
import { RouterOutlet, NavigationEnd, RouterLink, Router, RouterModule } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BlogComponent } from './blog/blog.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { ConfigService } from './services/config.service';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    BlogComponent,
    ChatboxComponent,
    MarkdownComponent,
    RouterLink,
    RouterModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'site';
  markdown = `## Markdown __enabled__!`;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public router: Router, readonly appConfig: ConfigService) {
    this.router.events.subscribe((event) => {
      // console.log(event);
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-Z53CZW86HN', { 'page_path': event.urlAfterRedirects });
      }
    })
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      initFlowbite();
    }
  }
}