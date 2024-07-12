const fs = require('fs');
const path = require('path');
const nlp = require('compromise');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');
const { text } = require('stream/consumers');
const configData = require('../src/assets/config.json');

// Define the path for the index file
const srcDir = configData.blogSourceDirectory;

const blogs = [];

(async () => {
  try {
    console.log("Initiating data preparation..");
    const files = await fs.promises.readdir(srcDir);
    let id = 1;
    for (const file of files) {
      const fullPath = path.join(srcDir, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isFile() && file.endsWith(".md")) {
        if (file.toLowerCase().includes(".draft.")) {
          console.log("Ignoring file designated as draft ..", file);
        } else {
          console.log("Processing file ..", file);
          const textContent = fs.readFileSync(fullPath).toString();
          const lines = textContent.split('\r\n');
          const wordsList = getTotalWords(textContent);

          const blog = {
            id: id,
            slug: file.replace(".md", ""),
            title: getAfterSpace(lines[1]),
            created: getAfterSpace(lines[2]),
            updated: getAfterSpace(lines[3]),
            tags: getAfterSpace(lines[4]),
            description: getAfterSpace(lines[5]),
            words: getUniqueWords(wordsList),
            link: "",
            length: wordsList.length
          };

          blogs.push(blog);

          id++;
        }
      }
    }

    writeBlogs();
    writeRoutes();
    writeSitemap();

  } catch (e) {
    // Catch anything bad that happens
    console.error("Error occurred!", e);
  }
})();

// returns the rest after the first space
function getAfterSpace(str) {
  return str.substr(str.indexOf(' ') + 1);
}

function writeBlogs() {
  file = './src/assets/blogs.json';
  console.log("Writing blogs..", file);
  var json = JSON.stringify(blogs);
  fs.writeFile(file, json, "utf8", () => { });
}

function writeRoutes() {
  file = './routes.txt';
  const routes = [];
  routes.push('/home', '/about', '/projects', '/blogs');
  blogs.forEach(blog => { routes.push('/blogs/' + blog.slug) });
  console.log("Writing routes..", file);
  fs.writeFile(file, routes.join('\r\n'), "utf8", () => { });
}

function writeSitemap() {
  file = './sitemap.xml';
  const links = [
    { url: '/home', changefreq: 'monthly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.5 },
    { url: '/projects', changefreq: 'monthly', priority: 0.7 },
    { url: '/blogs', changefreq: 'weekly', priority: 1 },
  ];

  blogs.forEach(blog => {
    const link = {
      url: '/blogs/' + blog.slug,
      changefreq: 'monthly',
      priority: 0.5
    }
    links.push(link);
  });

  const sitemapStream = new SitemapStream({ hostname: configData.hostname });
  const xmlStream = streamToPromise(Readable.from(links).pipe(sitemapStream));
  console.log('Writing sitemap', file);
  xmlStream
    .then((data) => {
      fs.createWriteStream(file).write(data.toString());
    })
    .catch((error) => {
      console.error('An error occurred when generating sitemap', error);
    });
}

function getUniqueWords(totalWords) {
  // Filter out duplicates and return the unique words
  const uniqueWords = [...new Set(totalWords)];
  return uniqueWords.join(' ');
}

function stripTags(text) {
  let cleanText = text.replace(/<[^>]*>/g, '');
  cleanText = cleanText.replace(/<!--.*?-->/gs, '');
  cleanText = cleanText.replace(/\(http.*?\)/gs, '');
  cleanText = cleanText.replace(/[^0-9a-zA-Z\s+]/g, '');
  cleanText = cleanText.replace(/_/g, '').toLowerCase();
  return cleanText;
}

function getTotalWords(fileContent) {
  let doc = nlp(stripTags(fileContent));
  doc = doc.remove('#Preposition #Determiner #Conjunction #Pronoun');
  return doc.text().split(/\s+/);
}

function printColor(str, color) {
  colorCode = '';
  switch (color) {
    case 'red':
      colorCode = "\x1b[31m";
      break;
    case 'yellow':
      colorCode = "\x1b[33m";
      break;
    case 'green':
      colorCode = "\x1b[32m";
      break;
    case 'blue':
      colorCode = "\x1b[34m";
      break;
    default:
      colorCode = "x1b[0m";
  }
  return colorCode;
}