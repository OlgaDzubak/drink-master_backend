require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const swRouter = require('./routes/steering-wheels');

const app = express();   

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/steering-wheels/', swRouter);

app.use((req, res) => { 
  res.status(404).json({ message: 'Not found' });
})

app.use((err, req, res, next) => {
  console.log("err = ",err);
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, });
})

module.exports = app;
