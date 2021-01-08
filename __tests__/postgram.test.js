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


    it('adds a postgram image url into postgram table using post', async() => {
      const agent = request.agent(app)
      const user = await UserService.create({
        email: "test@test.com",
        password: "password",
        profilePhotoURL: "myspecialphoto.jpg" 
      });
      
      await agent 
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
    
    it('get all posts', async() => {
      const agent = request.agent(app)
      const user = await UserService.create({
        email: "test@test.com",
        password: "password",
        profilePhotoURL: "myspecialphoto.jpg" 
      });
      
      await agent 
      .post('/api/v1/auth/login')
      .send({
        email: "test@test.com",
        password: "password",
        profilePhotoURL: "myspecialphoto.jpg" 
      })
    
      const grams = await Promise.all([
        { 
        userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: "cool story bro",
        tags: ['yolo', 'carpe diem']},
        { userId: user.id,
          photoURL: 'jim.jpg',
          caption: "cool story Jim",
          tags: ['mofo', 'fomo'] }
      ].map(postgram => Postgram.insert(postgram)));
    
        const res = await agent
        .get('/api/v1/postgram');
        
        console.log(res.body);
        expect(res.body).toEqual([{
          id: expect.any(String),
          userId: user.id,
          photoURL: 'selfphoto.jpg',
          caption: "cool story bro",
          tags: ['yolo', 'carpe diem']
          },{
          id: expect.any(String),
          userId: user.id,
          photoURL: 'jim.jpg',
          caption: "cool story Jim",
          tags: ['mofo', 'fomo'] 
        }]); 
        
    });
});

// it('gets all recipes', async() => {
//   const recipes = await Promise.all([
//     { name: 'cookies', ingredients: [], directions: [] },
//     { name: 'cake', ingredients: [], directions: [] },
//     { name: 'pie', ingredients: [], directions: [] }
//   ].map(recipe => Recipe.insert(recipe)));

//   return request(app)
//     .get('/api/v1/recipes')
//     .then(res => {
//       recipes.forEach(recipe => {
//         expect(res.body).toContainEqual(recipe);
//       });
//     });
// });