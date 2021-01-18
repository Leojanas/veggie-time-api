const gardenRouter = require("./garden-router")

const gardenService = {
    getGarden(knex, user_id){
        return knex('garden')
            .join('veggies', 'garden.veggie_id', '=', 'veggies.id')
            .where('garden.user_id', user_id)
            .select('veggies.veggie_name', 'veggies.germination_days', 'veggies.thinning_days', 'veggies.harvest_days', 'garden.plant_date', 'garden.id')
    },
    addVeggie(knex, veggie){
        return knex
            .insert(veggie)
            .into('garden')
            .returning('*')
    }
}

module.exports = gardenService;