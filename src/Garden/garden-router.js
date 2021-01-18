const express = require('express');
const gardenRouter = express.Router();
const gardenService = require('./garden-service');
const usersService = require('../Users/usersService');
const jsonParser = express.json();

gardenRouter
    .use(jsonParser, (req,res,next) => {
        let {user_id} = req.body;
        if(!user_id){
            return res.status(401).json({error: {message: 'Must provide a user_id.'}})
        }
        usersService.checkUserId(req.app.get('db'), user_id)
            .then(user => {
                if(user){
                    next()
                }else{
                    return res.status(401).json({error: {message: 'Must provide a valid user_id.'}})
                }
            })
    })

gardenRouter
    .route('/')
    .get((req,res,next) => {
        console.log('called get')
        let {user_id} = req.body;
        gardenService.getGarden(req.app.get('db'), user_id)
            .then(garden => res.status(200).json(garden))
    })


module.exports = gardenRouter;