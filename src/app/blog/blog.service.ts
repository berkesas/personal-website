import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

import { Blog } from './blog';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class BlogService {
    blogUrl = '/assets/blogs.json';
    private handleError: HandleError;

    constructor(
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('BlogService');
      }

    getBlogs(): Observable<Blog[]> {
        return this.http.get<Blog[]>(this.blogUrl)
            .pipe(
                catchError(this.handleError('getBlogs', []))
            );
    }
}