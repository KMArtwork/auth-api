'use strict';

process.env.SECRET='secretstring'

const bearer = require('./bearer')
const jwt = require('jsonwebtoken');
const { usersDB, users } = require('../models/index')

let userInfo = {
  username: 'kawika',
  password: '12345',
  role: 'admin'
}

beforeAll(async () => {
  await usersDB.sync();
  await users.create(userInfo)
});

afterAll(async () => {
  await usersDB.drop();
});

describe('Testing bearer authentication', () => {

  const req = {
    headers: {
      authorization: null
    }
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res)
  };
  const next = jest.fn();

  test('fails to get all users when token is invalid', () => {

    req.headers.authorization = 'Bearer tokenisinvalid';

    return bearer(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith('Invalid Login');
      })
  });

  test('successfully logs in when a token is valid', () => {
    const user = {username: 'kawika'}
    const token = jwt.sign(user, process.env.SECRET);

    req.headers.authorization = `Bearer ${token}`;

    return bearer(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalledWith();
      })
  })

})