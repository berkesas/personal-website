const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const minify = require('html-minifier-terser').minify;

const options = {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
    minifyCSS: true
};

filesArray = [
    {
        source: "./sitemap.xml",
        destination: "./dist/site/browser/sitemap.xml"
    },
    {
        source: "./.htaccess",
        destination: "./dist/site/browser/.htaccess"
    },
    {
        source: "C:\\www\\test\\javascript-animations\\index_3d_free_camera.html",
        destination: "./dist/site/browser/index_3d.html"
    }
]

filesArray.forEach(element => {
    fs.copyFile(element.source, element.destination, (err) => {
        if (err) throw err;
        console.log(element.source + ' was copied to ' + element.destination);
    });
});

async function minifyFile() {
    const inputFile = './dist/site/browser/index_3d.html';
    const outputFile = inputFile; // Overwrite the same file

    try {
        // Read the HTML file using promises version
        const html = await fsPromises.readFile(inputFile, 'utf8');

        // Minify options
        const options = {
            collapseWhitespace: true,
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true
        };

        // Minify the HTML
        const minified = await minify(html, options);

        // Write to output file using promises version
        await fsPromises.writeFile(outputFile, minified, 'utf8');

        console.log('✅ Minification complete!');
        console.log(`Original size: ${(html.length / 1024).toFixed(2)} KB`);
        console.log(`Minified size: ${(minified.length / 1024).toFixed(2)} KB`);
        console.log(`Saved: ${(((html.length - minified.length) / html.length) * 100).toFixed(1)}%`);

    } catch (error) {
        console.error('❌ Minify Error:', error.message);
        process.exit(1);
    }
}

/**
 * Removes <app-header> and <app-footer> elements from HTML content
 * and modifies specific CSS classes
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - The processed HTML content
 */
function removeHeaderFooter(htmlContent) {
    // Remove <app-header> and its contents (including nested elements)
    let result = htmlContent.replace(
        /<header[^>]*>[\s\S]*?<\/header>/gi,
        ''
    );

    result = result.replace(
        /<app-chatbox[^>]*>[\s\S]*?<\/app-chatbox>/gi,
        ''
    );

    // Remove <app-footer> and its contents (including nested elements)
    result = result.replace(
        /<app-footer[^>]*>[\s\S]*?<\/app-footer>/gi,
        ''
    );

    // Change class="pt-8 pb-16 lg:pt-16 to class="pt-4 pb-16 lg:pt-4
    result = result.replace(
        /class="pt-8 pb-16 lg:pt-16/g,
        'class="p-4 pt-4 pb-16 lg:pt-4'
    );

    // Change class="py-5 to class="py-0
    result = result.replace(
        /class="py-5/g,
        'class="py-2'
    );

    // Add custom font size style for p and ul tags
    result = result.replace(
        /(<\/style>)/i,
        'p, ul { font-size: 1.3rem; }$1'
    );

    // Modify link targets for external domains
    result = modifyLinkTargets(result);

    return result;
}

/**
 * Modifies <a> tag targets to target="_parent" if the href is not pointing to https://nazarmammedov.com
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - The processed HTML content
 */
function modifyLinkTargets(htmlContent) {
    return htmlContent.replace(
        /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi,
        (match, before, href, after) => {
            // Parse the URL to check the host
            try {
                const url = new URL(href, 'https://nazarmammedov.com');

                // Check if it's not the main domain
                if (url.hostname !== 'nazarmammedov.com') {
                    // Remove any existing target attribute
                    let attrs = (before + ' ' + after).replace(/\s+target=["'][^"']*["']/gi, '');
                    // Add target="_parent"
                    return `<a ${attrs.trim()} href="${href}" target="_parent">`;
                }
            } catch (e) {
                // If URL parsing fails (e.g., relative URLs), leave unchanged
            }

            // Return original match if it's the same domain or parsing failed
            return match;
        }
    );
}

/**
 * Process a single HTML file - removes header/footer and saves as _plain.html
 * @param {string} filePath - Path to the HTML file to process
 */
function processHtmlFile(filePath) {
    try {
        // Read the original file
        const content = fs.readFileSync(filePath, 'utf8');

        // Remove header and footer elements
        const processedContent = removeHeaderFooter(content);

        // Generate new filename with _plain.html pattern
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const basename = path.basename(filePath, ext);
        const newFilePath = path.join(dir, `${basename}_plain${ext}`);

        // Write the processed content to new file
        fs.writeFileSync(newFilePath, processedContent, 'utf8');

        console.log(`✓ Created: ${newFilePath}`);
        return newFilePath;
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        throw error;
    }
}

/**
 * Process multiple HTML files in a directory
 * @param {string} dirPath - Directory containing HTML files
 * @param {boolean} recursive - Whether to process subdirectories
 */
function processDirectory(dirPath, recursive = false) {
    try {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory() && recursive) {
                processDirectory(filePath, recursive);
            } else if (stat.isFile() && path.extname(file) === '.html') {
                // Skip files that already have _plain suffix
                if (!file.endsWith('_plain.html')) {
                    processHtmlFile(filePath);
                }
            }
        });
    } catch (error) {
        console.error(`✗ Error processing directory ${dirPath}:`, error.message);
        throw error;
    }
}

if (require.main === module) {
    // List of files to process
    const filesToProcess = [
        // Add your file paths here, for example:
        './dist/site/browser/about/index.html',
        './dist/site/browser/contact/index.html',
        './dist/site/browser/projects/index.html',
        './dist/site/browser/bloglist/index.html',
    ];

    console.log('Starting HTML processing...\n');

    if (filesToProcess.length === 0) {
        console.log('No files specified. Add file paths to the filesToProcess array.');
    } else {
        filesToProcess.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                processHtmlFile(filePath);
            } else {
                console.log(`⚠ File not found: ${filePath}`);
            }
        });
    }

    minifyFile();

    console.log('\nHTML processing complete!');
}

// Export functions for use as a module
module.exports = {
    removeHeaderFooter,
    processHtmlFile,
    processDirectory,
    minifyFile
};