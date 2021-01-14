const express = require('express');
const allVeggiesRouter = express.Router();
const veggiesService = require('./all-veggies-service');

allVeggiesRouter
    .route('/')
    .get((req, res, next) => {
        veggiesService(req.app.get('db'))
            .then(veggies => {
                return res.status(200).json(veggies)
            })
            .catch(next)
    })