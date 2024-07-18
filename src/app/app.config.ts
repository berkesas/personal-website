import { APP_INITIALIZER, ApplicationConfig, Provider, importProvidersFrom, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MARKED_OPTIONS, CLIPBOARD_OPTIONS, ClipboardButtonComponent, provideMarkdown } from 'ngx-markdown';
import { markedOptionsFactory } from './marked-options-factory';
import { SecurityContext } from '@angular/core';
import { HttpClientJsonpModule, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';
import { ConfigService } from './services/config.service';
import { BlogService } from './services/blog.service';
import { provideAnimations } from '@angular/platform-browser/animations';

export function provideConfigInitializer(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => {
      const configService = inject(ConfigService);
      return () => configService.load();
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BlogService },
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(HttpClientJsonpModule),
    HttpErrorHandler,
    MessageService,
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideMarkdown({
      sanitize: SecurityContext.NONE,
      loader: HttpClient,
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory
      },
      clipboardOptions: {
        provide: CLIPBOARD_OPTIONS,
        useValue: {
          buttonComponent: ClipboardButtonComponent,
        },
      },
    }),
    provideConfigInitializer()
  ]
};
