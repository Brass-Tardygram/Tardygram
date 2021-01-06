const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    UserService
      .insert(req.body)
      .then(user => res.send(user))
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    UserService
      .insert(req.body)
      .then(user => res.send(user))
      .catch(next);
  });  

