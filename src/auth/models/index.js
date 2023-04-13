'use strict';

const userModel = require('./users.js');
const { Sequelize, DataTypes } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:testmemory;';

const sequelize = new Sequelize(DATABASE_URL);

module.exports = {
  usersDB: sequelize,
  users: userModel(sequelize, DataTypes),
}