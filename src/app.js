require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const allVeggiesRouter = require('./AllVeggies/all-veggies-router');
const eventsRouter = require('./Events/events-router');
const gardenRouter = require('./Garden/garden-router');
const authenticationRouter = require('./Authentication/authentication-router');
const usersRouter = require('./Users/users-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/allVeggies', allVeggiesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/garden', gardenRouter);
app.use('/api/auth', authenticationRouter);
app.use('/api/users', usersRouter);



app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    }else{
         console.error(error)
         response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app