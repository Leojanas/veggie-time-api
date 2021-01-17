const gardenRouter = require("./garden-router")

const gardenService = {
    getGarden(knex, user_id){
        return knex('garden')
            .join('veggies', 'garden.veggie_id', '=', 'veggies.id')
            .select('')
    }
}

module.exports = gardenService;