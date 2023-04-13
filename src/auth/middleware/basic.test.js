'use strict'

const basic = require('./basic');
const base64 = require('base-64');
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
})

describe('Testing basic authentication', () => {

  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  };
  const next = jest.fn();

  test('Fails on login attempt with invalid username', () => {
    const basicAuthString = base64.encode('kawik:12345');

    req.headers = {
      authorization: `Basic ${basicAuthString}`
    };

    return basic(req, res, next)
      .then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403)
      })
  });

  test('Fails on login attempt with invalid username', () => {
    const basicAuthString = base64.encode('kawika:54321');

    req.headers = {
      authorization: `Basic ${basicAuthString}`
    };

    return basic(req, res, next)
      .then(() => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403)
      })
  });

  test('Successfully logs in with valid credentials', () => {
    const basicAuthString = base64.encode('kawika:12345');

    req.headers = {
      authorization: `Basic ${basicAuthString}`
    };

    return basic(req, res, next)
      .then(() => {
        expect(next).toHaveBeenCalled();
      })
  });

})