const eventsService = {
    getAllEvents(knex, user_id) {
        return knex('events')
            .select('*')
            .where('user_id', user_id)
    },
    getEventById(knex, id, user_id){
        return knex('events')
            .select('*')
            .where({'id': id, 'user_id': user_id})
            .first()
    },
    updateEvent(knex, id, body){
        return knex('events')
            .where('id', id)
            .update(body)
            .returning('*')
    }
};

module.exports = eventsService;