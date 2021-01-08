const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('. routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it ('allows a user to sign up via POST', () => {
    //email, password
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'test@test.com', password:'password', profilePhotoURL: 'someoneSpecial.jpg' })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'test@test.com',
          profilePhotoURL: 'someoneSpecial.jpg',
        });
      });
  });

  it('allows a user to login via POST', async() => {
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'someoneSpecial.jpg'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'someoneSpecial.jpg' 
      });

    expect(res.body).toEqual({
      id: user.id,
      email: 'test@test.com',
      profilePhotoURL: 'someoneSpecial.jpg'
    });
  });

  it('verifies a user is logged in', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'someoneSpecial.jpg' 
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'someoneSpecial.jpg' 
      });

    const res = await agent
      .get('/api/v1/auth/verify');
    
    expect(res.body).toEqual({
      id: user.id,
      email: 'test@test.com',
      profilePhotoURL: 'someoneSpecial.jpg' 
    });
  });
});
