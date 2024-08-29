import { Component, SecurityContext, Input, SimpleChanges, ApplicationConfig } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import data from '../../assets/blogs.json';
import { Blog } from '../common/types/blog';
import { TimeComponent } from '../common/ui/time/time.component';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    MarkdownComponent,
    TimeComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
})

export class PageComponent {
  @Input() page!: string;
  current_page!: string | null;
  path = '';
  tags!: string[];

  constructor(readonly appConfig: ConfigService, private _sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['page'] !== undefined) {
      this.current_page = this._sanitizer.sanitize(SecurityContext.HTML, changes['page'].currentValue);
    }
    // console.log(changes);
    // console.log(this.path);

    this.path = 'assets/pages/' + this.current_page + '.md';
    // console.log(this.page_path);
  }

}
