const express = require('express');
require('newrelic');

const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('app up');
})
