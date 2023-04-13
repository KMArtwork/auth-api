'use strict';

require('dotenv').config();

const server = require('./src/server');
const PORT = process.env.PORT || 3001
const { usersDB } = require('./src/auth/models/index')
const { foodAndClothesDB } = require('./src/models/index');
 
usersDB.sync()
.then(async () => {
  await foodAndClothesDB.sync();
})
.then(() => {
  server.start(PORT);
})
