
const veggiesService = {
    getAllVeggies(knex){
        return knex(veggies).select(id, veggie_name)
    }
};

module.exports = veggiesService;