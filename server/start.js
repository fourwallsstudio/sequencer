const express = require('express');
const app = express();

app.use(express.static('docs'));

app.listen(3000, () => {
  console.log('app up');
})
