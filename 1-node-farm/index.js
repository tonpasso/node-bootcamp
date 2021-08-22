const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require('./modules/replaceTemplate')

/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${new Date()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-Blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//     fs.writeFile('./txt/final.txt', `${data2}\n${data3}. \nCreated on ${new Date()}`, 'utf-8', err => {
//       console.log('Your file has been written!')
//     })
//     });
//   });
// });
// console.log('Read this first');

/////////////////////////////////
// SERVER
///{%PRODUCTNAME%}/g = all the placeholders will be replaced

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
// dataObj is an array with the 5 objects that came from data.json
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true, true));
  const { query, pathname } = url.parse(req.url, true);
 

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const htmlCards = dataObj.map(element => replaceTemplate(tempCard, element)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', htmlCards);
    res.end(output);

  // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

  // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);

  // Not Found Page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "WellPasso",
    });
    res.end("<h1>Sorry, page not found!</h1>");
  }
});

// Listening to income requests
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});