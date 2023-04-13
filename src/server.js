'use strict'

const express = require('express');
const cors = require('cors');

const errorHandler = require('./error-handlers/500');
const notFoundHandler = require('./error-handlers/404');
const logger = require('./middleware/logger');
const authRoutes = require('./auth/routes');
const v1Routes = require('./routes/v1');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// v1Routes handle CRUD for 'food' and 'clothes' models
app.use('/api/v1', v1Routes)

// authRoutes handles user Authentication & Authorization
app.use(authRoutes)

app.use('*', notFoundHandler)
app.use(errorHandler)

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};