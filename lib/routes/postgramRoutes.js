const { Router } = require('express');
const Postgram = require('../models/Postgram');



module.exports = Router() 


.post('/', (req, res, next) => {
    Postgram
    .insert(req.body)
    .then(postgram => res.send(postgram))
    .catch(next)
})