import { Component, SecurityContext, Input, SimpleChanges, ApplicationConfig } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import data from '../../assets/blogs.json';
import { Blog } from '../common/types/blog';
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
  selector: 'app-blogview',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive,
    MarkdownComponent,
    TimeComponent,
    ReadingTimePipe],
  templateUrl: './blogview.component.html',
  styleUrl: './blogview.component.css'
})
export class BlogviewComponent {
  @Input() slug!: string;
  current_slug!: string | null;
  blog!: Blog | undefined;
  tags!: string[];
  path = '';

  constructor(readonly appConfig: ConfigService, private _sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['slug'] !== undefined) {
      this.current_slug = this._sanitizer.sanitize(SecurityContext.HTML, changes['slug'].currentValue);
      this.blog = data.find((item) => item.slug == this.slug);
      if (this.blog) {
        this.tags = this.blog.tags.split(' ');
      }

      // console.log(data[0].title);
    }
    // console.log(changes);
    // console.log(this.path);

    this.path = 'assets/blogs/' + this.current_slug + '.md';
    // console.log(this.page_path);
  }
}