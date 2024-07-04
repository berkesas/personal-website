const fs = require('fs');
const path = require('path');

filesArray = [
    {
        source: "./sitemap.xml",
        destination: "./dist/site/browser/sitemap.xml"
    }
]

filesArray.forEach(element => {
    fs.copyFile(element.source, element.destination, (err) => {
        if (err) throw err;
        console.log(element.source + ' was copied to ' + element.destination);
    });
});