const eventsService = {
    getAllEvents(knex, user_id) {
        return knex('events')
            .select('*')
            .where('user_id', user_id)
    },
};

module.exports = eventsService;