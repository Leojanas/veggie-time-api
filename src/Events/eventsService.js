const eventsService = {
    getAllEvents(knex) {
        return knex('events').select('*')
    },
};

module.exports = eventsService;