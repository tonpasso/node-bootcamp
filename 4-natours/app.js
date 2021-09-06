const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send(console.log('Hello, world!')); 
})



const PORT = 3000;
app.listen(PORT, () => console.log('Port:',PORT));