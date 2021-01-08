const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Comment = require('../lib/models/Comment');
const UserService = require('../lib/services/UserService');

describe('. routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
    
  afterAll(() => {
    return pool.end();
  });

  it('adds a comment', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'face.jpg'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'face.jpg'
      });

    const post = await agent
      .post('/api/v1/postgram')
      .send({
        userId: user.id,
        photoURL: 'whatever.jpg',
        caption: 'doin stuff',
        tags: ['the world is a trash fire']
      });

    const comment = await agent
      .post('/api/v1/comments')
      .send({
        commentBy: user.id,
        post: post.body.id,
        comment: 'Lookin sick my dude'
      });

    expect(comment.body).toEqual({
      id: expect.any(String),
      commentBy: user.id,
      post: post.body.id,
      comment: 'Lookin sick my dude'
    });

  });

  it('deletes a comment', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoURL: 'face.jpg'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoURL: 'face.jpg'
      });

    const post = await agent
      .post('/api/v1/postgram')
      .send({
        userId: user.id,
        photoURL: 'whatever.jpg',
        caption: 'doin stuff',
        tags: ['the world is a trash fire']
      });

    const comment = await Comment
      .insert({
        commentBy: user.id,
        post: post.body.id,
        comment: 'Lookin sick my dude'
      });

    return await agent
      .delete(`/api/v1/comments/${comment.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          commentBy: user.id,
          post: post.body.id,
          comment: 'Lookin sick my dude'
        });
      });
  });
});
