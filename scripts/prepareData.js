const fs = require('fs');
const path = require('path');
const nlp = require('compromise');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// Define the path for the index file
const srcDir = "./src/assets/blogs";

const blogs = [];

(async () => {
  try {
    const files = await fs.promises.readdir(srcDir);
    let id = 1;
    for (const file of files) {
      const fullPath = path.join(srcDir, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isFile() && file.endsWith(".md")) {
        console.log("processing", file);
        const textContent = fs.readFileSync(fullPath).toString();
        const lines = textContent.split('\r\n');

        const blog = {
          id: id,
          slug: file.replace(".md", ""),
          title: getAfterSpace(lines[1]),
          created: getAfterSpace(lines[2]),
          updated: getAfterSpace(lines[3]),
          tags: getAfterSpace(lines[4]),
          description: getAfterSpace(lines[5]),
          words: getUniqueWords(textContent),
          link: "",
        };

        blogs.push(blog);

        id++;
      }
    }

    writeBlogs();
    writeRoutes();
    writeSitemap();

  } catch (e) {
    // Catch anything bad that happens
    console.error("Error!", e);
  }
})();

// returns the rest after the first space
function getAfterSpace(str) {
  return str.substr(str.indexOf(' ') + 1);
}

function writeBlogs() {
  file = './src/assets/blogs.json';
  console.log("writing blogs", file);
  var json = JSON.stringify(blogs);
  fs.writeFile(file, json, "utf8", () => { });
}

function writeRoutes() {
  file = './routes.txt';
  const routes = [];
  routes.push('/home', '/about', '/projects', '/blogs');
  blogs.forEach(blog => { routes.push('/blogs/' + blog.slug) });
  console.log("writing routes", file);
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

  const sitemapStream = new SitemapStream({ hostname: 'https://nazarmammedov.com/' });
  const xmlStream = streamToPromise(Readable.from(links).pipe(sitemapStream));
  console.log('writing sitemap', file);
  xmlStream
    .then((data) => {
      fs.createWriteStream(file).write(data.toString());
    })
    .catch((error) => {
      console.error('Error generating sitemap', error);
    });
}

function getUniqueWords(fileContent) {
  let cleanText = fileContent.replace(/<[^>]*>/g, '');
  cleanText = cleanText.replace(/<!--.*?-->/gs, '');
  cleanText = cleanText.replace(/\(http.*?\)/gs, '');
  cleanText = cleanText.replace(/[^0-9a-zA-Z\s+]/g, '');
  cleanText = cleanText.replace(/[^0-9a-zA-Z\s+]/g, '').replace(/_/g, '').toLowerCase();
  let doc = nlp(cleanText);
  doc = doc.remove('#Preposition #Determiner #Conjunction #Pronoun');
  const words = doc.text().split(/\s+/);
  // Filter out duplicates and return the unique words
  const uniqueWords = [...new Set(words)];
  return uniqueWords.join(' ');
}