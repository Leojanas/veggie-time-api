const express = require('express');
const gardenRouter = express.Router();
const gardenService = require('./garden-service');
const veggiesService = require('../AllVeggies/all-veggies-service');
const {requireAuth} = require('../Middleware/authentication');
const jsonParser = express.json();

gardenRouter
    .use(requireAuth)

gardenRouter
    .route('/')
    .get((req,res,next) => {
        let {user_id} = req.payload;
        gardenService.getGarden(req.app.get('db'), user_id)
            .then(garden => {
                let response = veggiesService.formatVeggies(garden)
                res.status(200).json(response)
            })
    })
    .post(jsonParser, (req,res,next) => {
        let {veggie_id, plant_date} = req.body;
        let { user_id } = req.payload;
        if(!plant_date){
            plant_date = null;
        }
        let veggie = {veggie_id, user_id, plant_date};
        gardenService.addVeggie(req.app.get('db'), veggie)
            .then(veggies => {
                let response = veggiesService.formatVeggies(veggies)
                res.status(201).json(response[0])
            })
    })

gardenRouter
    .route('/:id')
    .all((req,res,next) => {
        gardenService.getVeggieById(req.app.get('db'), req.params.id)
            .then(veggie => {
                if(!veggie){
                    return res.status(404).json({error: {message: 'Resource Not Found'}})
                }
                if(veggie.user_id !== req.payload.user_id){
                    return res.status(401).json({error: {message: 'Unauthorized request.'}})
                }
                else{
                    next()
                }
            })
    })
    .patch(jsonParser, (req,res,next) => {
        let {plant_date} = req.body;
        gardenService.updateVeggie(req.app.get('db'), req.params.id, plant_date)
            .then(() => res.status(204).end())
    })
    .delete((req,res,next) => {
        gardenService.deleteVeggie(req.app.get('db'), req.params.id)
        .then(() => res.status(204).end())
    })


module.exports = gardenRouter;