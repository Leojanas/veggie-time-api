const usersService = {
    checkUserId(knex, id) {
        return knex('users')
            .select('*')
            .where('id', id)
            .first()
    }
}

module.exports = usersService;