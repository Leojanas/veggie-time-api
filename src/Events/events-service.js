const eventsService = {
    getAllEvents(knex, user_id) {
        return knex('events')
            .select('*')
            .where('user_id', user_id)
    },
    getEvent(knex, id){
        return knex('events')
            .select('*')
            .where('id', id)
            .first()
    },
    getEventById(knex, id, user_id){
        return knex('events')
            .select('*')
            .where({'id': id, 'user_id': user_id})
            .first()
    },
    insertEvent(knex, body){
        return knex
            .insert(body)
            .into('events')
            .returning('*')
    },
    updateEvent(knex, id, body){
        return knex('events')
            .where('id', id)
            .update(body)
            .returning('*')
    },
    deleteEvent(knex, id){
        return knex('events')
            .where('id', id)
            .delete()
    }
};

module.exports = eventsService;