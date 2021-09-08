const fs = require('fs');
const express = require('express');

const app = express();

const toursInfo = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: toursInfo.length,
    data: {
      tours: toursInfo
    }
  });
});


const PORT = 3001;
app.listen(PORT, () => console.log('Port:',PORT));