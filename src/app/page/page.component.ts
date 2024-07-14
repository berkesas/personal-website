import { Component, SecurityContext, Input, SimpleChanges, ApplicationConfig } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import data from '../../assets/blogs.json';
import { Blog } from '../blog/blog';
import { TimeComponent } from '../common/ui/time/time.component';
import { ConfigService } from '../services/config.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readingTime',
  standalone: true,
})

export class ReadingTimePipe implements PipeTransform {
  transform(wordCount: any, args?: any): any {
    if (!wordCount) return 1;
    return Math.ceil(wordCount / 265);
  }
}

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLinkActive, 
    MarkdownComponent, 
    TimeComponent, 
    ReadingTimePipe],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
})

export class PageComponent {
  @Input() section!: string;
  @Input() page!: string;
  @Input() blog!: Blog | undefined;
  current_section!: string | null;
  current_page!: string | null;
  page_path = '';
  tags!: string[];

  constructor(readonly appConfig: ConfigService, private _sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['section'] !== undefined) {
      this.current_section = this._sanitizer.sanitize(SecurityContext.HTML, changes['section'].currentValue);
    }

    if (changes['page'] !== undefined) {
      this.current_page = this._sanitizer.sanitize(SecurityContext.HTML, changes['page'].currentValue);
      if (this.current_section == 'blogs') {
        this.blog = data.find((item) => item.slug == this.current_page);
        if (this.blog) {
          this.tags = this.blog.tags.split(' ');
        }

        // console.log(data[0].title);
      }
    }
    // console.log(changes);
    // console.log(this.page_path);

    this.page_path = 'assets/' + this.current_section + '/' + this.current_page + '.md';
    // console.log(this.page_path);
  }

}
