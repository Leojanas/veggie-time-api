const express = require('express');
const eventsRouter = express.Router();
const eventsService = require('./eventsService');

eventsRouter
    .route('/')
    .get((req,res,next) => {
        eventsService.getAllEvents(req.app.get('db'))
            .then(events => {
                return res.status(200).json(events)
            })
            .catch(next)
    })

module.exports = eventsRouter;