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
        let {user_id} = req.body;
        gardenService.getGarden(req.app.get('db'), user_id)
            .then(garden => res.status(200).json(garden))
    })
    .post(jsonParser, (req,res,next) => {
        let {veggie_id, user_id, plant_date} = req.body;
        if(!plant_date){
            plant_date = null;
        }
        let veggie = {veggie_id, user_id, plant_date};
        gardenService.addVeggie(req.app.get('db'), veggie)
            .then(veggies => res.status(201).json(veggies[0]))
    })


module.exports = gardenRouter;