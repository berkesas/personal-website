import { Component } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { Blog } from '../common/types/blog';
import { BlogService } from '../services/blog.service';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { TimeComponent } from '../common/ui/time/time.component';
import { Title } from '@angular/platform-browser';
import { BlogCardComponent } from '../blog/blog-card.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MarkdownComponent, BlogCardComponent, TimeComponent, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  loading = true;

  constructor(private blogService: BlogService, private router: Router, private titleService: Title) { }

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs(): void {
    this.blogService.getBlogs()
      .subscribe(blogs => { this.blogs = blogs; this.filteredBlogs = blogs; this.loading = false; })
  }

  filterBlogs(text: string) {
    if (!text) {
      this.filteredBlogs = this.blogs;
      return;
    }
    this.filteredBlogs = this.blogs.filter((blog) =>
      blog?.words.includes(text.toLowerCase()),
    );
  }

  onFilterChange(event: any): void {
    const filter = event.target.value;
    this.filterBlogs(filter);
  }
}
