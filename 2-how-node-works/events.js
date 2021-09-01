const EventEmitter = require("events");
const http = require("http");

const PORT = 8000;
const LOCAL_HOST = '127.0.0.1';

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!')
});

myEmitter.on('newSale', () => {
  console.log('Costumer name: Wellington.')
});

myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock.`)
});

myEmitter.emit('newSale', 9);

// Creating a server

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('New request received!');
  console.log(req.url);
  res.end('Request received.')
});

server.on("request", (_req, _res) => {
  console.log("Getting another request.");
});

server.on('close', () => {
  console.log('Closing connection')
});

server.listen(PORT, LOCAL_HOST, () => {
  console.log('Waiting for requests...')
});