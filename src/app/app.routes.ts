import { Routes, UrlSegment } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { PageComponent } from './page/page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { BlogviewComponent } from './blogview/blogview.component';

export const routes: Routes = [
    {
        path: 'bloglist',
        title: 'Blog',
        component: BlogComponent
    },
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent
    },
    {
        title: 'Blog',
        matcher: (url) => {
            if (url.length === 2 && url[0].path.match('blog') && url[1].path.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/gm)) {
                // console.log('matching blogs',url.length);
                return { consumed: url, posParams: { slug: new UrlSegment(url[1].path.slice(0), {}) } };

            }
            return null;
        },
        component: BlogviewComponent
    },
    {
        title: 'Nazar Mammedov',
        matcher: (url) => {
            if (url.length === 1 && url[0].path.match(/^[\w]+$/gm)) {
                // console.log('matching pages',url.length);
                return { consumed: url, posParams: { page: new UrlSegment(url[0].path.slice(0), {}) } };
            }
            return null;
        },
        component: PageComponent
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent },
];
