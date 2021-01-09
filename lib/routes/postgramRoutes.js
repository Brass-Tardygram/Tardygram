const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Postgram = require('../models/Postgram');



module.exports = Router() 


  .post('/', ensureAuth, (req, res, next) => {
    Postgram
      .insert({ ...req.body, userId: req.user.id })
      .then(postgram => res.send(postgram))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Postgram
      .find()
      .then(postgram => res.send(postgram))
      .catch(next);
  })

  .get('/popular', ensureAuth, (req, res, next) => {
    Postgram
      .findPopular()
      .then(postgram => res.send(postgram))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    Postgram
      .findById(req.params.id)
      .then(postgram => res.send(postgram))
      .catch(next);
  })

  .put('/:id', ensureAuth, (req, res, next) => {
    Postgram
      .update(req.params.id, { ...req.body, userId: req.user.id })
      .then(postgram => res.send(postgram))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Postgram
      .delete(req.params.id, req.user.id)
      .then(postgram => res.send(postgram))
      .catch(next);
  });
