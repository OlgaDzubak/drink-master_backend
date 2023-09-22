require('dotenv').config();             // підключаємо змінні оточення

const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express'); // Swagger-doc - документація
const swaggerDocument = require('./swagger.json'); // Swagger-doc - документація

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const filtersRouter = require('./routes/filters');
const drinksRouter = require('./routes/drinks');


const app = express();   // створюємо сервер

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Swagger-doc - документація

app.use('/auth', authRouter);             // корневий маршрут для регістрації, авторизації, розавторизації
app.use('/users', usersRouter);           // корневий маршрут для роботи з залогіненим юзером
app.use('/filters', filtersRouter);       // корневий маршрут для роботи з колекцією Recipes (фільтрація)
app.use('/drinks', drinksRouter);         // корневий маршрут для роботи з колекцією Recipes ()


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, });
})

module.exports = app;
