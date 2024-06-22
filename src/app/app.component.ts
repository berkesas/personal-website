import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterOutlet, NavigationEnd, RouterLink, Router, RouterModule } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BlogComponent } from './blog/blog.component';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    BlogComponent,
    MarkdownComponent,
    RouterLink,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'site';
  markdown = `## Markdown __enabled__!`;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public router: Router) {
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