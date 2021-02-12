const express = require('express');
const eventsRouter = express.Router();
const eventsService = require('./events-service');
const usersService = require('../Users/usersService');
const authenticationRouter = require('../Authentication/authentication-router');
const jsonParser = express.json();
const { requireAuth } = require('../Middleware/authentication');

eventsRouter.use(authenticationRouter);

eventsRouter
    .use(requireAuth)

eventsRouter
    .route('/')
    .get((req,res,next) => {
        let {user_id} = req.payload;
        eventsService.getAllEvents(req.app.get('db'), user_id)
            .then(events => {
                return res.status(200).json(events)
            })
            .catch(next)
    })
    .post(jsonParser, (req,res,next) => {
        let {event_type, event_date, completed, notes} = req.body;
        let {user_id} = req.payload;
        let types = ['planting', 'thinning', 'watering', 'weeding', 'harvesting']
        if(!event_type || !event_date || !notes){
            return res.status(400).json({error: {message: 'One or more event attributes missing or invalid'}})
        }
        if(!types.includes(event_type)){
            return res.status(400).json({error: {message: 'One or more event attributes missing or invalid'}})
        }
        let event = {event_type, event_date, completed, notes, user_id};
        eventsService.insertEvent(req.app.get('db'), event)
            .then(event => res.status(201).json(event[0]))
            .catch(next)
    })

eventsRouter
    .route('/:id')
    .all((req,res,next) => {
        eventsService.getEvent(req.app.get('db'), req.params.id)
            .then(event => {
                if(!event){
                    return res.status(404).json({error: {message: 'Resource Not Found'}})
                }
                if(event.user_id !== req.payload.user_id){
                    return res.status(401).json({error: {message: 'Unauthorized request.'}})
                }
                res.locals.event = event
                next()
            })
    })
    .get(jsonParser, (req,res,next) => {
        return res.status(200).json(res.locals.event)
    })
    .patch(jsonParser, (req,res,next) => {
        const {event_type, event_date, completed, notes} = req.body;
        if(!event_type && !event_date && !completed && !notes){
            return res.status(400).json({error: {message: 'Must update at least one field.'}})
        }
        eventsService.updateEvent(req.app.get('db'),req.params.id, req.body)
            .then(event => res.status(200).json(event[0]))
            .catch(next)
    })
    .delete((req,res,next) => {
        eventsService.deleteEvent(req.app.get('db'), req.params.id)
            .then(() => res.status(204).end())
    })
    

module.exports = eventsRouter;