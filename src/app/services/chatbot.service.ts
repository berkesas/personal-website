import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { ConfigService } from './config.service';
import { Observable, catchError, of } from 'rxjs';
import { ChatBotMessage } from '../common/types/chatbotmessage';

@Injectable({ providedIn: 'root' })
export class ChatBotService {
    private handleError: HandleError;

    constructor(
        readonly appConfig: ConfigService,
        private http: HttpClient,
        httpErrorHandler: HttpErrorHandler) {
        this.handleError = httpErrorHandler.createHandleError('ChatBotService');
    }

    getResponse(question: string): Observable<ChatBotMessage[]> {
        const errorMessage: ChatBotMessage = {
            source: 'server',
            text: 'I apologize for the inconvenience but I cannot access the server at the moment. You can message me at LinkedIn if you have any questions.',
            created: (new Date()).toISOString(),
            additionalQuestions: []
        };

        if (this.appConfig.config?.chatBotService) {
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
            const questionMessage = { text: question };
            return this.http.post<ChatBotMessage[]>(this.appConfig.config?.chatBotService, questionMessage, { headers })
                .pipe(
                    catchError(this.handleError("getResponse", [errorMessage]))
                );
        } else {
            return of([errorMessage]);
        }
    }
}