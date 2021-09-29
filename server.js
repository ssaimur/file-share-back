// external package imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

// internal package import
require('./config/db')();

// general middlewares
app.use(morgan('common'));
app.use(express.json());

app.use('/api/posts', require('./routes/fileRoute'));
app.use('/files', require('./routes/showRoute'));
app.use('/files/download', require('./routes/downloadRoute'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
