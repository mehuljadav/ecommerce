const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Route Imports
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const globalErrorHandler = require('./controllers/errorController');

// config file is only required on development mode
if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config({ path: './config/config.env' });
}

const app = express();
// General Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Middlewares
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use(globalErrorHandler);

module.exports = app;
