'use strict'

const server = require('../src/server');
const base64 = require('base-64');
const { usersDB, users } = require('../src/auth/models/index');
const supertest = require('supertest');
const app = supertest(server.server)

let userInfo = {
  username: 'kawika',
  password: '12345',
  role: 'admin'
}

let token;

beforeAll(async() => {
  await usersDB.sync();
})

afterAll(async() => {
  await usersDB.drop({});
})

describe('Testing authorization & authentication routes', () => {

  test('Can successfully sign up a new user', async() => {
    let response = await app.post('/signup').send(userInfo);

    expect(response.body.user.username).toEqual('kawika');
    expect(response.body.user.role).toEqual('admin');
  })

  test('Can successfully sign in as an existing user', async() => {
    let encodedCredentials = base64.encode(`${userInfo.username}:${userInfo.password}`);

    let response = await app.post('/signin').set(`Authorization`, `Basic ${encodedCredentials}`);

    token = response.body.user.token;

    expect(response.body.user.username).toEqual('kawika');
    expect(response.body.user.role).toEqual('admin');
    expect(response.body.user.token).toBeTruthy();
  })

  test('Can successfully read from /users', async() => {
    let response = await app.get('/users').set(`Authorization`, `Bearer ${token}`);

    expect(response.body[0]).toBe('kawika');
  })

  test('Can access secret area', async() => {
    let response = await app.get('/secret').set(`Authorization`, `Bearer ${token}`);

    expect(response.text).toBe('Welcome to the secret area')
  })
  
})