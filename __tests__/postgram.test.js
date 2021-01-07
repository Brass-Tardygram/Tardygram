const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Postgram = require('../lib/models/Postgram');
const UserService = require('../lib/services/UserService');
const User = require('../lib/models/User');


describe('. routes', () => {
    beforeEach(() => {
      return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });
  
    afterAll(() => {
      return pool.end();
    });


    it.only ('adds a postgram image url into postgram table using post', async() => {
      const agent = request.agent(app)
      const user = await UserService.create({
        email: "test@test.com",
        password: "password",
        profilePhotoURL: "myspecialphoto.jpg" 
      });
      
     const booger = await agent 
      .post('/api/v1/auth/login')
      .send({
        email: "test@test.com",
        password: "password",
        profilePhotoURL: "myspecialphoto.jpg" 
      })
    
      const res = await agent
        .post('/api/v1/postgram')
        .send({
          userId: user.id,
          photoURL: 'selfphoto.jpg',
          caption: "cool story bro",
          tags: ['yolo', 'carpe diem']
      })
        expect(res.body).toEqual({
          id: expect.any(String),
          userId: user.id,
          photoURL: 'selfphoto.jpg',
          caption: "cool story bro",
          tags: ['yolo', 'carpe diem']
      }); 
    });



});


