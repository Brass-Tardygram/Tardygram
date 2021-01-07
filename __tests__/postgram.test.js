const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Postgram = require('../lib/models/Postgram');


describe('. routes', () => {
    beforeEach(() => {
      return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });
  
    afterAll(() => {
      return pool.end();
    });


    it.only ('adds a postgram image url into postgram table using post', async() => {
      const res = await request(app)
        .post('/api/v1/postgram')
        .send({
          userId: "1",
          photoURL: 'selfphoto.jpg',
          caption: "cool story bro",
          tags: ['yolo', 'carpe diem']
      })

        expect(res.body).toEqual({
          id: "1",
          userId: 1,
          photoURL: 'selfphoto.jpg',
          caption: "cool story bro",
          tags: ['yolo', 'carpe diem']
      }); 
    });



});


