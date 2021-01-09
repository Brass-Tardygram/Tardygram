const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Postgram = require('../lib/models/Postgram');
const UserService = require('../lib/services/UserService');
const Comment = require('../lib/models/Comment');


describe('. routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  
  afterAll(() => {
    return pool.end();
  });


  it('adds a postgram image url into postgram table using post', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'myspecialphoto.jpg' 
    });
      
    await agent 
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'myspecialphoto.jpg' 
      });
    
    const res = await agent
      .post('/api/v1/postgram')
      .send({
        userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: 'cool story bro',
        tags: ['yolo', 'carpe diem']
      });
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      photoURL: 'selfphoto.jpg',
      caption: 'cool story bro',
      tags: ['yolo', 'carpe diem']
    }); 
  });
    
  it('get all posts', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'myspecialphoto.jpg' 
    });
      
    await agent 
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'myspecialphoto.jpg' 
      });
    
    await Promise.all([
      { 
        userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: 'cool story bro',
        tags: ['yolo', 'carpe diem'] },
      { userId: user.id,
        photoURL: 'jim.jpg',
        caption: 'cool story Jim',
        tags: ['mofo', 'fomo'] }
    ].map(postgram => Postgram.insert(postgram)));
    
    const res = await agent
      .get('/api/v1/postgram');
        
    expect(res.body).toEqual([{
      id: expect.any(String),
      userId: user.id,
      photoURL: 'selfphoto.jpg',
      caption: 'cool story bro',
      tags: ['yolo', 'carpe diem']
    }, {
      id: expect.any(String),
      userId: user.id,
      photoURL: 'jim.jpg',
      caption: 'cool story Jim',
      tags: ['mofo', 'fomo'] 
    }]); 
  });

  it('get post by id', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'myspecialphoto.jpg' 
    });
      
    await agent 
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'myspecialphoto.jpg' 
      });
    
    const gram = await Postgram
      .insert({ 
        userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: 'cool story bro',
        tags: ['yolo', 'carpe diem']
      });
      
    const res = await agent
      .get(`/api/v1/postgram/${gram.id}`);  

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      photoURL: 'selfphoto.jpg',
      caption: 'cool story bro',
      tags: ['yolo', 'carpe diem']
    }); 
  });

  it('updates a post caption with PATCH', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'myspecialphoto.jpg' 
    });
    
    await agent 
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'myspecialphoto.jpg' 
      });
  
    const gram = await Postgram
      .insert({ 
        userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: 'cool story bro',
        tags: ['yolo', 'carpe diem']
      });
      
    const res = await agent
      .put(`/api/v1/postgram/${gram.id}`)
      .send({
        caption:'Living my best life'
      });
      
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.id,
      photoURL: 'selfphoto.jpg',
      caption:'Living my best life',
      tags: ['yolo', 'carpe diem']
    }); 
  });

  it('deletes a post', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'myspecialphoto.jpg' 
    });
    
    await agent 
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'myspecialphoto.jpg' 
      });
  
    const gram = await Postgram
      .insert({ 
        userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: 'cool story bro',
        tags: ['yolo', 'carpe diem']
      });
      
    return await agent 
      .delete(`/api/v1/postgram/${gram.id}`)
      
      .then(res => {
        expect(res.body).toEqual({ id: expect.any(String),
          userId: user.id,
          photoURL: 'selfphoto.jpg',
          caption:'cool story bro',
          tags: ['yolo', 'carpe diem'] });
      });
  });

  it('get popular posts', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'myspecialphoto.jpg' 
    });
      
    await agent 
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'myspecialphoto.jpg' 
      });
    
    const posts = await Promise.all([
      { userId: user.id,
        photoURL: 'selfphoto.jpg',
        caption: 'cool story bro',
        tags: ['yolo', 'carpe diem'] },
      { userId: user.id,
        photoURL: 'jim.jpg',
        caption: 'cool story Jim',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'pam.jpg',
        caption: 'cool story Pam',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'dwight.jpg',
        caption: 'cool story Dwight',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'andy.jpg',
        caption: 'cool story Andy',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'angela.jpg',
        caption: 'cool story Angela',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'oscar.jpg',
        caption: 'cool story Oscar',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'meredith.jpg',
        caption: 'cool story Meredith',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'bob.jpg',
        caption: 'cool story Bob',
        tags: ['mofo', 'fomo'] },
      { userId: user.id,
        photoURL: 'kevin.jpg',
        caption: 'cool story Kevin',
        tags: ['mofo', 'fomo'] }
    ].map(postgram => Postgram.insert(postgram)));

    await Promise.all([
      {
        commentBy: user.id,
        post: 4,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 7,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 1,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 4,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 2,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 10,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 9,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 5,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 3,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 7,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 9,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 8,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 3,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 6,
        comment: 'Lookin sick my dude'
      }, {
        commentBy: user.id,
        post: 4,
        comment: 'Lookin sick my dude'
      }
    ].map(comment => Comment.insert(comment)));
    
    const res = await agent
      .get('/api/v1/postgram/popular');
        
    expect(res.body).toEqual(expect.arrayContaining((posts))); 
  });
});
