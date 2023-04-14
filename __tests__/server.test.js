'use strict'

const server = require('../src/server');
const { usersDB, users } = require('../src/auth/models/index');
const {foodAndClothesDB} = require('../src/models/index')
const supertest = require('supertest');
const app = supertest(server.server);

beforeAll(async() => {
  await usersDB.sync();
  await foodAndClothesDB.sync()
})

afterAll(async() => {
  await usersDB.drop();
  await foodAndClothesDB.drop()
})

describe('Testing V2 routes', () => {

  let userInfo = {
    username: 'admin',
    password: 'password',
    role: 'admin'
  }

  let food = {
    name: 'pizza',
    calories: '1000',
    type: 'fruit'
  }

  let clothing = {
    name: 'hoodie',
    color: 'blue',
    size: 'xl'
  }

  let token;

  test('Can POST to food', async () => {
    let res = await app.post('/signup').send(userInfo);

    token = res.body.user.token;

    let response = await app.post('/api/v2/food').set(`Authorization`, `Bearer ${token}`).send(food);

    expect(response.body.name).toBe('pizza');
    expect(response.body.calories).toBe('1000');
    expect(response.body.type).toBe('fruit');
  })

  test('Can POST to clothes', async () => {
    let response = await app.post('/api/v2/clothes').set(`Authorization`, `Bearer ${token}`).send(clothing);

    expect(response.body.name).toBe('hoodie');
    expect(response.body.color).toBe('blue');
    expect(response.body.size).toBe('xl');
  })

  test('Can GET ALL from food', async () => {
    let response = await app.get('/api/v2/food').set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
  })

  test('Can GET ALL from clothes', async () => {
    let response = await app.get('/api/v2/clothes').set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
  })

  test('Can GET ONE from food', async () => {
    let response = await app.get('/api/v2/food/1').set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
  })

  test('Can GET ONE from clothes', async () => {
    let response = await app.get('/api/v2/clothes/1').set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
  })

  test('Can PUT to food', async () => {
    let newFood = {
      name: 'apple',
      calories: '50',
      type: 'fruit'
    }
    let response = await app.put('/api/v2/food/1').set(`Authorization`, `Bearer ${token}`).send(newFood);

    expect(response.status).toBe(200);
  })

  test('Can PUT to clothes', async () => {
    let newClothing = {
      name: 'tshirt',
      color: 'purple',
      size: 'sm'
    }
    let response = await app.put('/api/v2/clothes/1').set(`Authorization`, `Bearer ${token}`).send(newClothing);

    expect(response.status).toBe(200);
  })

  test('Can PATCH to food', async () => {
    let newFood = {
      name: 'green apple',
    }
    let response = await app.patch('/api/v2/food/1').set(`Authorization`, `Bearer ${token}`).send(newFood);

    expect(response.status).toBe(200);
  })

  test('Can PATCH to clothes', async () => {
    let newClothing = {
      color: 'red',
    }
    let response = await app.patch('/api/v2/clothes/1').set(`Authorization`, `Bearer ${token}`).send(newClothing);

    expect(response.status).toBe(200);
  })

  test('Can DELETE food', async () => {
    let response = await app.delete('/api/v2/food/1').set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
  })

  test('Can DELETE clothes', async () => {
    let response = await app.delete('/api/v2/clothes/1').set(`Authorization`, `Bearer ${token}`);

    expect(response.status).toBe(200);
  })
})