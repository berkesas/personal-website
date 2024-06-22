import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
    const renderer = new MarkedRenderer();

    renderer.blockquote = (text: string) => {
        return '<blockquote class="blockquote"><p>' + text + '</p></blockquote>';
    };

    renderer.paragraph = (text: string) => {
        return '<p class=\'mb-6 mt-1 md:mb-5 lg:mb-4\'>' + text + '</p>';
    };

    renderer.heading = (text: string, level: number) => {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
        var size = 'text-xl';
        switch (level) {
            case 1: size = 'text-4xl md:text-5xl lg:text-5xl'; break;
            case 2: size = 'text-3xl md:text-4xl lg:text-4xl'; break;
            case 3: size = 'text-2xl md:text-3xl lg:text-3xl'; break;
            case 4: size = 'text-1xl md:text-2xl lg:text-2xl'; break;
            case 5: size = 'text-xl md:text-1xl lg:text-1xl'; break;
            default: size = 'text-xl';
        }
        return '<h' + level + ' class=\'py-1 ' + size + '  dark:text-white font-bold leading-none tracking-tight text-gray-700\'>' +
            '<a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
            '<span class="header-link"></span>' +
            '</a>' + text +
            '</h' + level + '>';
    };

    renderer.list = (body: string, ordered: boolean, start: number) => {
        if (ordered) {
            return '<ol class=\'ml-5 my-5 list-decimal list-inside\'>' + body + '</ol>';
        }
        else
            return '<ul class=\'ml-5 my-5 list-disc list-inside\'>' + body + '</ul>';
    }

    renderer.link = (href: string, title: string, text: string) => {
        return "<a class='underline text-primary-700' href='" + href + "' title='" + title + "'>" + text + "</a>";
    }

    return {
        renderer: renderer,
        gfm: true,
        breaks: false,
        pedantic: false,
    };
}