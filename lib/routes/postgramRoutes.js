const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Postgram = require('../models/Postgram');



module.exports = Router() 


.post('/', ensureAuth, (req, res, next) => {
    Postgram
    .insert({ ...req.body, userId: req.user.id })
    .then(postgram => res.send(postgram))
    .catch(next)
})