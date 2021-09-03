const fs = require("fs");
const server = require("http").createServer();

const PORT = 8000;
const URL = "127.0.0.1";

server.on("request", (req, res) => {
  // First solution - node has to load the entire file into memory before send to data
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Second solution: Streams - create a stream that consumes the data piece by piece
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on("data", piece => {
  //   res.write(piece)
  // });
  // readable.on('end', () => {
  //   res.end();
  // });
  // readable.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found');
  // });

  // Third Solution - pipe operator
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
  // readableSource.pipe(writeableDestination: in this case the response)


});

server.listen(PORT, URL, () => {
  console.log("Listening...");
});
