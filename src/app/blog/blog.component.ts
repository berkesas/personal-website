import { Component } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { Blog } from './blog';
import { BlogService } from './blog.service';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { TimeComponent } from '../common/ui/time/time.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule,
    MarkdownComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TimeComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  providers: [BlogService],
})
export class BlogComponent {
  blogs: Blog[] = [];
  loading = true;

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs(): void {
    this.blogService.getBlogs()
      .subscribe(blogs => { (this.blogs = blogs); this.loading = false; })
  }

  // navigate(route: string) {
  //   this.router.navigate([route]);
  // }
}
