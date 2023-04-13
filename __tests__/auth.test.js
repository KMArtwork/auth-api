'use strict'

const basic = require('../src/auth/middleware/basic')
const bearer = require('../src/auth/middleware/bearer')
const acl = require('../src/auth/middleware/acl')
const jwt = require('jsonwebtoken');
const base64 = require('base-64');
const { usersDB, users } = require('../models/index')

describe('Testing auth routes', () => {
  
})