import { Component, SecurityContext, Input, SimpleChanges } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, MarkdownComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css'
})

export class PageComponent {
  @Input() section!: string;
  @Input() page!: string;
  current_section!: string | null;
  current_page!: string | null;
  page_path = '';

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['section'] !== undefined) {
      this.current_section = this._sanitizer.sanitize(SecurityContext.HTML, changes['section'].currentValue);
    }
    if (changes['page'] !== undefined) {
      this.current_page = this._sanitizer.sanitize(SecurityContext.HTML, changes['page'].currentValue);
    }
    // console.log(changes);
    // console.log(this.page_path);

    this.page_path = 'assets/' + this.current_section + '/' + this.current_page + '.md';
    // console.log(this.page_path);
  }

}
