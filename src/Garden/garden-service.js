const gardenRouter = require("./garden-router")

const gardenService = {
    getGarden(knex, user_id){
        return knex('garden')
            .join('veggies', 'garden.veggie_id', '=', 'veggies.id')
            .where('garden.user_id', user_id)
            .select('veggies.veggie_name', 'veggies.germination_days', 'veggies.thinning_days', 'veggies.harvest_days', 'garden.plant_date', 'garden.id', 'veggies.row_spacing', 'veggies.plant_spacing')
    },
    getVeggieById(knex, id){
        return knex('garden')
            .select('*')
            .where('id', id)
            .first()
    },
    addVeggie(knex, veggie){
        return knex
            .insert(veggie)
            .into('garden')
            .returning('*')
    },
    updateVeggie(knex, id, plant_date){
        return knex('garden')
            .where('id', id)
            .update('plant_date', plant_date)
    },
    deleteVeggie(knex, id){
        return knex('garden')
            .where('id', id)
            .delete()
    }
}

module.exports = gardenService;