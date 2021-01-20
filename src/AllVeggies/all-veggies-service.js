
const veggiesService = {
    getAllVeggies(knex){
        return knex('veggies').select('*')
    },
    addVeggie(knex, veggie){
        return knex
            .insert(veggie)
            .into('veggies')
            .returning('*')

    }
};

module.exports = veggiesService;