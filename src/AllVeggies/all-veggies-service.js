
const veggiesService = {
    getAllVeggies(knex){
        return knex('veggies').select('*')
    },
    addVeggie(knex, veggie){
        return knex
            .insert(veggie)
            .into('veggies')
            .returning('*')

    },
    formatVeggies(array){
        return array.map(veggie => {
            let formattedVeggie = {};
            formattedVeggie.id = veggie.id;
            formattedVeggie.veggie_name = veggie.veggie_name;
            formattedVeggie.daysUntil = {
                germination: veggie.germination_days, 
                thinning: veggie.thinning_days,
                harvest: veggie.harvest_days
            };
            formattedVeggie.spacing = {
                row: veggie.row_spacing,
                plant: veggie.plant_spacing
            }
            return formattedVeggie;
        })
    }
};

module.exports = veggiesService;