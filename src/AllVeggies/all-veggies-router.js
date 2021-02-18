const express = require('express');
const allVeggiesRouter = express.Router();
const veggiesService = require('./all-veggies-service');
const jsonParser = express.json();

allVeggiesRouter
    .route('/')
    .get((req, res, next) => {
        veggiesService.getAllVeggies(req.app.get('db'))
            .then(veggies => {
                let output = veggiesService.formatVeggies(veggies)
                return res.status(200).json(output)
            })
            .catch(next)
    })
    .post(jsonParser, (req,res,next) => {
        let {veggie_name, daysUntil, spacing} = req.body;
        if(!veggie_name || !spacing.row || !spacing.plant || !daysUntil.germination || !daysUntil.harvest){
            return res.status(400).json({error: {message: 'At least one required field is missing.'}})
        }
        let thinning_days = null;
        let row_spacing = req.body.spacing.row;
        let plant_spacing = req.body.spacing.plant;
        let germination_days = req.body.daysUntil.germination;
        let harvest_days = req.body.daysUntil.harvest;
        if(req.body.daysUntil.thinning){
            thinning_days = req.body.daysUntil.thinning;
        }
        let veggie = {veggie_name, row_spacing, plant_spacing, germination_days, thinning_days, harvest_days};
        veggiesService.addVeggie(req.app.get('db'), veggie)
            .then(veggies => {
                let output = veggiesService.formatVeggies(veggies)
                res.status(201).json(output[0])
            })
            .catch(next)

    })

module.exports = allVeggiesRouter;