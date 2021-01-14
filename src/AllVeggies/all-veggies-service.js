
const veggiesService = {
    getAllVeggies(knex){
        return knex('veggies').select('*')
    }
};

module.exports = veggiesService;