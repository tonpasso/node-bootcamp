const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${new Date()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written!');

// Non-Blocking, asynchronous way

// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//     fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}. \nCreated on ${new Date()}`, 'utf-8', err => {
//       console.log('Your file has been written!')
//     })
//     });
//   });
// });
// console.log('Read this first');

/////////////////////////////////
// SERVER
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf8');
// dataObj is an array with the 5 objects that came from data.json
const dataObs = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the Overview Page!");

  // Product Page
  } else if (pathName === "/product") {
    res.end("This is the Product Page.");

  // API
  } else if (pathName === "/api") {
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