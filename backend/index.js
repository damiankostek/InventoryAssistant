const express = require('express');
const app = express();
const port = 8080;

const mongojs = require('mongojs')
const db = mongojs('mongodb+srv://dkostek:<password>@cluster0.zai7k7p.mongodb.net/', ['Inventory'])



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });