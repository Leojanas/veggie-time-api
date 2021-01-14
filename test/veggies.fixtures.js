function makeVeggiesArray() {
    return [
        {
            veggie_name: 'Beets',
            row_spacing: 16,
            plant_spacing: 4,
            germination_days: 8,
            thinning_days: 15,
            harvest_days: 60
        },
        {
            veggie_name: 'Radishes',
            row_spacing: 8,
            plant_spacing: 2,
            germination_days: 5,
            thinning_days: 10,
            harvest_days: 45
        }

    ]
}

module.exports = makeVeggiesArray;