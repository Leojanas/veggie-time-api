const express = require('express');
const eventsRouter = express.Router();
const eventsService = require('./eventsService');
const usersService = require('../Users/usersService');
const jsonParser = express.json();

eventsRouter
    .route('/')
    .all(jsonParser, (req,res,next) => {
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
    .get((req,res,next) => {
        let {user_id} = req.body;
        eventsService.getAllEvents(req.app.get('db'),user_id)
            .then(events => {
                return res.status(200).json(events)
            })
            .catch(next)
    })

module.exports = eventsRouter;