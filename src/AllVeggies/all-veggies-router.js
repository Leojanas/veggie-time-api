const express = require('express');
const allVeggiesRouter = express.Router();
const veggiesService = require('./all-veggies-service');
const jsonParser = express.json();

allVeggiesRouter
    .route('/')
    .get((req, res, next) => {
        veggiesService.getAllVeggies(req.app.get('db'))
            .then(veggies => {
                return res.status(200).json(veggies)
            })
            .catch(next)
    })
    .post(jsonParser, (req,res,next) => {
        let {veggie_name, row_spacing, plant_spacing, germination_days, harvest_days} = req.body;
        if(!veggie_name || !row_spacing || !plant_spacing || !germination_days || !harvest_days){
            return res.status(400).json({error: {message: 'At least one required field is missing.'}})
        }
        let thinning_days = null;
        if(req.body.thinning_days){
            thinning_days = req.body.thinning_days;
        }
        let veggie = {veggie_name, row_spacing, plant_spacing, germination_days, thinning_days, harvest_days};
        veggiesService.addVeggie(req.app.get('db'), veggie)
            .then(veggies => res.status(201).json(veggies[0]))
            .catch(next)

    })

module.exports = allVeggiesRouter;