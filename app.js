require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const filtersRouter = require('./routes/filters');
const drinksRouter = require('./routes/drinks');
const ingredientsRouter = require('./routes/ingredients');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));

const { CLIENT_URL } = process.env;
const corsOptions = { origin: CLIENT_URL, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/filters', filtersRouter);
app.use('/drinks', drinksRouter);
app.use('/ingredients', ingredientsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
})

app.use((err, req, res, next) => {
  console.log("err = ",err);
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, });
})

module.exports = app;
