const express = require('express');
const eventsRouter = express.Router();
const eventsService = require('./eventsService');
const usersService = require('../Users/usersService');
const { json } = require('express');
const jsonParser = express.json();

eventsRouter
    .use(jsonParser, (req,res,next) => {
        let {user_id} = req.body;
        if(!user_id){
            return res.status(400).json({error: {message: 'Must provide a user_id.'}})
        }
        usersService.checkUserId(req.app.get('db'), user_id)
            .then(user => {
                if(user){
                    next()
                }else{
                    return res.status(400).json({error: {message: 'Must provide a valid user_id.'}})
                }
            })
    })

eventsRouter
    .route('/')
    .get((req,res,next) => {
        let {user_id} = req.body;
        eventsService.getAllEvents(req.app.get('db'),user_id)
            .then(events => {
                return res.status(200).json(events)
            })
            .catch(next)
    })

eventsRouter
    .route('/:id')
    .get(jsonParser, (req,res,next) => {
        let {user_id} = req.body;
        eventsService.getEventById(req.app.get('db'), req.params.id, user_id)
            .then(event => {
                if(!event){
                    return res.status(401).json({error: {message: 'Unauthorized request'}})
                }
                return res.status(200).json(event)
            })
    })
    .patch(jsonParser, (req,res,next) => {
        const {user_id, event_type, event_date, completed, notes} = req.body;
        eventsService.getEventById(req.app.get('db'), req.params.id, user_id)
            .then(event => {
                if(!event){
                    return res.status(401).json({error: {message: 'Unauthorized request'}})
                }
                if(!event_type && !event_date && !completed && !notes){
                    return res.status(400).json({error: {message: 'Must update at least one field.'}})
                }
                eventsService.updateEvent(req.app.get('db'),req.params.id, req.body)
                .then(event => res.status(200).json(event[0]))
                .catch(next)
            })
            .catch(next)
    })
    

module.exports = eventsRouter;