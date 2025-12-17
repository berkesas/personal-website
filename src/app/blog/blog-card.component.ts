import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Blog } from '../common/types/blog';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 90): string {
        if (!value) return '';
        if (value.length <= limit) return value;
        return value.substring(0, limit).trim() + '...';
    }
}

@Component({
    selector: 'app-blog-card',
    standalone: true,
    imports: [CommonModule, RouterModule, TruncatePipe],
    template: `
    <div
      class="flex flex-col max-w-sm h-[500px] bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-hidden">
      <img 
        [src]="blog.image || 'https://via.placeholder.com/400x200'" 
        [alt]="blog.title"
        class="w-full h-48 object-cover flex-shrink-0"
      />
      <div class="flex flex-col flex-grow p-6">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex-shrink-0">
          <a 
            role="button" 
            [routerLink]="['/blog', blog.slug]">{{ blog.title }}
        </a>
        </h5>
        <p class="font-normal text-gray-700 dark:text-gray-400 flex-grow overflow-hidden">
          {{ blog.description | truncate:90 }}
        </p>
        <div class="flex-shrink-0">
          <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
            {{ formatTime(blog.created) }}
          </p>
          <div class="flex justify-end">
          <a 
            role="button" 
            [routerLink]="['/blog', blog.slug]"
            class="inline-block mt-2 items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            Read
          </a>
</div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class BlogCardComponent {
    @Input({ required: true }) blog!: Blog;

    formatTime(date: Date | string): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}