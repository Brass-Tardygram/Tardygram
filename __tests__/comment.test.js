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

  it.only('adds a comment', async() => {

  });

  it('deletes a comment', async() => {

  });
});
