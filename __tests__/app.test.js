const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const { agent } = require('supertest');

describe('. routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it ('allows a user to sign up via POST', () => {
    //email, password
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password:'password' })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          passwordHash: expect.any(String)
        });
      });
  });

  it('allows a user to login via POST', async() => {
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    expect(res.body).toEqual(user);
  });

  it('verifies a user is logged in', async() => {
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    const res = await agent
      .get('/app/v1/auth/verify');
    
    expect(res.body).toEqual(user);
  });
});
