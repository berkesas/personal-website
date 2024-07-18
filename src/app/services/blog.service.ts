import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { ConfigService } from './config.service';
import { Blog } from '../common/types/blog';
import { Observable, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogService {
    private handleError: HandleError;

    constructor(
        readonly appConfig: ConfigService,
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('BlogService');
    }

    getBlogs(): Observable<Blog[]> {
        if (this.appConfig.config?.blogDataSource) {
            return this.http.get<Blog[]>(this.appConfig.config?.blogDataSource)
                .pipe(
                    catchError(this.handleError('getBlogs', []))
                );
        } else {
            return of([]);
        }
    }
}